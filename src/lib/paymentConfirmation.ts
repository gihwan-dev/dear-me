import { createServerClient } from '@/lib/supabase';
import { confirmPayment } from '@/lib/tosspayments';

export class PaymentConfirmationError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'PaymentConfirmationError';
  }
}

interface ConfirmLetterPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface PaymentLookupRow {
  id: string;
  view_code: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_key: string | null;
  payment_amount: number;
}

interface ConfirmLetterPaymentResult {
  letterId: string;
  viewCode: string;
}

async function fetchLetterByOrderId(orderId: string): Promise<PaymentLookupRow> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('letters')
    .select('id, view_code, payment_status, payment_key, payment_amount')
    .eq('merchant_uid', orderId)
    .single();

  if (error || !data) {
    throw new PaymentConfirmationError('결제 주문 정보를 찾을 수 없습니다.', 404);
  }

  return data as PaymentLookupRow;
}

function buildSuccessResult(letter: PaymentLookupRow): ConfirmLetterPaymentResult {
  return {
    letterId: letter.id,
    viewCode: letter.view_code,
  };
}

export async function confirmLetterPayment({
  paymentKey,
  orderId,
  amount,
}: ConfirmLetterPaymentParams): Promise<ConfirmLetterPaymentResult> {
  if (!paymentKey || !orderId || !Number.isFinite(amount) || amount <= 0) {
    throw new PaymentConfirmationError('결제 정보가 올바르지 않습니다.', 400);
  }

  const letter = await fetchLetterByOrderId(orderId);

  if (letter.payment_amount !== amount) {
    throw new PaymentConfirmationError('결제 금액이 주문 정보와 일치하지 않습니다.', 400);
  }

  if (letter.payment_status === 'paid') {
    if (letter.payment_key === paymentKey) {
      return buildSuccessResult(letter);
    }

    throw new PaymentConfirmationError('이미 다른 결제 정보로 승인된 주문입니다.', 409);
  }

  try {
    const result = await confirmPayment({ paymentKey, orderId, amount });

    if (result.orderId !== orderId) {
      throw new PaymentConfirmationError('결제 응답의 주문번호가 일치하지 않습니다.', 502);
    }

    if (result.totalAmount !== amount) {
      throw new PaymentConfirmationError('결제 응답의 금액이 일치하지 않습니다.', 502);
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('letters')
      .update({
        payment_status: 'paid',
        payment_key: result.paymentKey,
        paid_at: result.approvedAt || new Date().toISOString(),
      })
      .eq('merchant_uid', orderId)
      .select('id, view_code, payment_status, payment_key, payment_amount')
      .single();

    if (error || !data) {
      const refreshed = await fetchLetterByOrderId(orderId);

      if (refreshed.payment_status === 'paid' && refreshed.payment_key === paymentKey) {
        return buildSuccessResult(refreshed);
      }

      throw new PaymentConfirmationError('결제는 승인됐지만 주문 상태를 저장하지 못했습니다.', 500);
    }

    return buildSuccessResult(data as PaymentLookupRow);
  } catch (error) {
    const refreshed = await fetchLetterByOrderId(orderId);

    if (refreshed.payment_status === 'paid' && refreshed.payment_key === paymentKey) {
      return buildSuccessResult(refreshed);
    }

    if (error instanceof PaymentConfirmationError) {
      throw error;
    }

    throw error;
  }
}
