import { createServerClient } from '@/lib/supabase';
import {
  describePaymentFailure,
  type PaymentFailurePresentation,
  type PaymentFailureSource,
} from '@/lib/paymentOutcome';
import { confirmPayment, TossApiError } from '@/lib/tosspayments';

export class PaymentConfirmationError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly rawMessage: string,
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
  payment_error_code: string | null;
  payment_error_message: string | null;
}

interface ConfirmLetterPaymentResult {
  letterId: string;
  viewCode: string;
}

interface RecordLetterPaymentFailureParams {
  orderId: string;
  code?: string | null;
  message?: string | null;
  source: PaymentFailureSource;
}

interface RecordLetterPaymentFailureResult {
  stored: boolean;
  status: 'missing' | 'paid' | 'failed';
  presentation: PaymentFailurePresentation;
}

async function findLetterByOrderId(orderId: string): Promise<PaymentLookupRow | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('letters')
    .select(
      'id, view_code, payment_status, payment_key, payment_amount, payment_error_code, payment_error_message',
    )
    .eq('merchant_uid', orderId)
    .maybeSingle();

  if (error) {
    throw buildPaymentConfirmationError(
      'ORDER_LOOKUP_FAILED',
      500,
      '결제 주문 정보를 조회하지 못했습니다.',
    );
  }

  return data as PaymentLookupRow | null;
}

async function fetchLetterByOrderId(orderId: string): Promise<PaymentLookupRow> {
  const letter = await findLetterByOrderId(orderId);

  if (!letter) {
    throw buildPaymentConfirmationError(
      'ORDER_NOT_FOUND',
      404,
      '결제 주문 정보를 찾을 수 없습니다.',
    );
  }

  return letter;
}

function buildSuccessResult(letter: PaymentLookupRow): ConfirmLetterPaymentResult {
  return {
    letterId: letter.id,
    viewCode: letter.view_code,
  };
}

function buildPaymentConfirmationError(
  code: string,
  status: number,
  rawMessage: string,
): PaymentConfirmationError {
  const presentation = describePaymentFailure({
    code,
    message: rawMessage,
    source: 'confirm',
  });

  return new PaymentConfirmationError(
    presentation.inlineMessage,
    status,
    presentation.code,
    presentation.rawMessage,
  );
}

export async function recordLetterPaymentFailure({
  orderId,
  code,
  message,
  source,
}: RecordLetterPaymentFailureParams): Promise<RecordLetterPaymentFailureResult> {
  const presentation = describePaymentFailure({ code, message, source });

  if (!orderId) {
    return {
      stored: false,
      status: 'missing',
      presentation,
    };
  }

  let letter: PaymentLookupRow | null;

  try {
    letter = await findLetterByOrderId(orderId);
  } catch (error) {
    console.error('Payment failure lookup error:', error);
    return {
      stored: false,
      status: 'missing',
      presentation,
    };
  }

  if (!letter) {
    return {
      stored: false,
      status: 'missing',
      presentation,
    };
  }

  if (letter.payment_status === 'paid') {
    return {
      stored: false,
      status: 'paid',
      presentation,
    };
  }

  if (
    letter.payment_status === 'failed' &&
    letter.payment_error_code === presentation.code &&
    letter.payment_error_message === presentation.rawMessage
  ) {
    return {
      stored: false,
      status: 'failed',
      presentation,
    };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('letters')
    .update({
      payment_status: 'failed',
      payment_error_code: presentation.code,
      payment_error_message: presentation.rawMessage,
    })
    .eq('merchant_uid', orderId);

  if (error) {
    console.error('Payment failure save error:', error);
    return {
      stored: false,
      status: 'failed',
      presentation,
    };
  }

  return {
    stored: true,
    status: 'failed',
    presentation,
  };
}

export async function confirmLetterPayment({
  paymentKey,
  orderId,
  amount,
}: ConfirmLetterPaymentParams): Promise<ConfirmLetterPaymentResult> {
  if (!paymentKey || !orderId || !Number.isFinite(amount) || amount <= 0) {
    throw buildPaymentConfirmationError(
      'INVALID_PAYMENT_PARAMS',
      400,
      '결제 정보가 올바르지 않습니다.',
    );
  }

  const letter = await fetchLetterByOrderId(orderId);

  if (letter.payment_amount !== amount) {
    throw buildPaymentConfirmationError(
      'PAYMENT_AMOUNT_MISMATCH',
      400,
      '결제 금액이 주문 정보와 일치하지 않습니다.',
    );
  }

  if (letter.payment_status === 'paid') {
    if (letter.payment_key === paymentKey) {
      return buildSuccessResult(letter);
    }

    throw buildPaymentConfirmationError(
      'PAYMENT_ALREADY_CONFIRMED_WITH_DIFFERENT_KEY',
      409,
      '이미 다른 결제 정보로 승인된 주문입니다.',
    );
  }

  try {
    const result = await confirmPayment({
      paymentKey,
      orderId,
      amount,
      idempotencyKey: `payment-confirm:${orderId}:${paymentKey}`,
    });

    if (result.orderId !== orderId) {
      throw buildPaymentConfirmationError(
        'PAYMENT_ORDER_MISMATCH',
        502,
        '결제 응답의 주문번호가 일치하지 않습니다.',
      );
    }

    if (result.totalAmount !== amount) {
      throw buildPaymentConfirmationError(
        'PAYMENT_AMOUNT_MISMATCH',
        502,
        '결제 응답의 금액이 일치하지 않습니다.',
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('letters')
      .update({
        payment_status: 'paid',
        payment_key: result.paymentKey,
        paid_at: result.approvedAt || new Date().toISOString(),
        payment_error_code: null,
        payment_error_message: null,
      })
      .eq('merchant_uid', orderId)
      .select(
        'id, view_code, payment_status, payment_key, payment_amount, payment_error_code, payment_error_message',
      )
      .single();

    if (error || !data) {
      const refreshed = await fetchLetterByOrderId(orderId);

      if (refreshed.payment_status === 'paid' && refreshed.payment_key === paymentKey) {
        return buildSuccessResult(refreshed);
      }

      throw buildPaymentConfirmationError(
        'PAYMENT_CONFIRM_SAVE_FAILED',
        500,
        '결제는 승인됐지만 주문 상태를 저장하지 못했습니다.',
      );
    }

    return buildSuccessResult(data as PaymentLookupRow);
  } catch (error) {
    const refreshed = await findLetterByOrderId(orderId);

    if (refreshed?.payment_status === 'paid' && refreshed.payment_key === paymentKey) {
      return buildSuccessResult(refreshed);
    }

    if (error instanceof PaymentConfirmationError) {
      throw error;
    }

    if (error instanceof TossApiError) {
      throw buildPaymentConfirmationError(
        error.code,
        error.status,
        error.rawMessage,
      );
    }

    throw buildPaymentConfirmationError(
      'PAYMENT_CONFIRM_FAILED',
      500,
      error instanceof Error ? error.message : '결제 확인 중 오류가 발생했습니다.',
    );
  }
}
