import { redirect } from 'next/navigation';
import {
  confirmLetterPayment,
  PaymentConfirmationError,
  recordLetterPaymentFailure,
} from '@/lib/paymentConfirmation';
import {
  buildPaymentFailurePath,
  readSingleValue,
} from '@/lib/paymentOutcome';

interface PaymentLoadingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentLoadingPage({
  searchParams,
}: PaymentLoadingPageProps) {
  const resolvedSearchParams = await searchParams;
  const paymentKey = readSingleValue(resolvedSearchParams.paymentKey);
  const orderId = readSingleValue(resolvedSearchParams.orderId);
  const amount = Number(readSingleValue(resolvedSearchParams.amount));

  let destination: string;

  if (!paymentKey || !orderId || !Number.isFinite(amount) || amount <= 0) {
    destination = buildPaymentFailurePath({
      orderId,
      code: 'INVALID_PAYMENT_PARAMS',
      message: '결제 정보가 올바르지 않습니다.',
      source: 'confirm',
    });
  } else {
    try {
      const result = await confirmLetterPayment({ paymentKey, orderId, amount });
      destination = `/sealed?sendId=${result.letterId}&type=send`;
    } catch (error) {
      const code =
        error instanceof PaymentConfirmationError
          ? error.code
          : 'PAYMENT_CONFIRM_FAILED';
      const message =
        error instanceof PaymentConfirmationError
          ? error.rawMessage
          : error instanceof Error
            ? error.message
            : '결제 확인 중 오류가 발생했습니다.';

      await recordLetterPaymentFailure({
        orderId,
        code,
        message,
        source: 'confirm',
      });

      destination = buildPaymentFailurePath({
        orderId,
        code,
        message,
        source: 'confirm',
      });
    }
  }

  redirect(destination);
}
