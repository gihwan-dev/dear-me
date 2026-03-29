import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  confirmLetterPayment,
  PaymentConfirmationError,
} from '@/lib/paymentConfirmation';

function readSingleValue(
  value: string | string[] | undefined,
): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return null;
}

interface PaymentSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const paymentKey = readSingleValue(resolvedSearchParams.paymentKey);
  const orderId = readSingleValue(resolvedSearchParams.orderId);
  const amount = Number(readSingleValue(resolvedSearchParams.amount));

  if (!paymentKey || !orderId || !Number.isFinite(amount)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-soft-black mb-2">
          결제 확인 실패
        </h2>
        <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] mb-6">
          결제 정보가 올바르지 않습니다.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-rose-gold text-white text-sm font-semibold font-[family-name:var(--font-body)]"
        >
          다시 시도하기
        </Link>
      </div>
    );
  }

  try {
    const result = await confirmLetterPayment({ paymentKey, orderId, amount });
    redirect(`/sealed?sendId=${result.letterId}&type=send`);
  } catch (error) {
    const message =
      error instanceof PaymentConfirmationError
        ? error.message
        : error instanceof Error
          ? error.message
          : '결제 확인 중 오류가 발생했습니다.';

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-soft-black mb-2">
          결제 확인 실패
        </h2>
        <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] mb-6">
          {message}
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-rose-gold text-white text-sm font-semibold font-[family-name:var(--font-body)]"
        >
          다시 시도하기
        </Link>
      </div>
    );
  }
}
