'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const message = searchParams.get('message') || '결제가 취소되었거나 실패했습니다.';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full bg-blush-light flex items-center justify-center mb-4">
        <span className="text-2xl">!</span>
      </div>
      <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-soft-black mb-2">
        결제가 완료되지 않았어요
      </h2>
      <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] mb-1">
        {message}
      </p>
      {code && (
        <p className="text-xs text-warm-gray/40 font-[family-name:var(--font-body)] mb-6">
          ({code})
        </p>
      )}
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 rounded-xl bg-rose-gold text-white text-sm font-semibold font-[family-name:var(--font-body)] cursor-pointer"
      >
        돌아가기
      </button>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-rose-gold/30 border-t-rose-gold rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
