'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setError('결제 정보가 올바르지 않습니다.');
      return;
    }

    // Confirm payment on server
    async function confirmPayment() {
      try {
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '결제 확인에 실패했습니다.');
        }

        // Redirect to sealed confirmation
        router.replace(`/sealed?sendId=${data.letterId}&type=send`);
      } catch (err) {
        setError(err instanceof Error ? err.message : '결제 확인 중 오류가 발생했습니다.');
      }
    }

    confirmPayment();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-soft-black mb-2">
          결제 확인 실패
        </h2>
        <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] mb-6">
          {error}
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl bg-rose-gold text-white text-sm font-semibold font-[family-name:var(--font-body)] cursor-pointer"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 size={32} className="animate-spin text-rose-gold mb-4" />
      <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)]">
        결제를 확인하고 있어요...
      </p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Loader2 size={32} className="animate-spin text-rose-gold mb-4" />
          <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)]">로딩 중...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
