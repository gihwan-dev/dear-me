import Link from 'next/link';
import { CircleAlert } from 'lucide-react';
import { recordLetterPaymentFailure } from '@/lib/paymentConfirmation';
import {
  describePaymentFailure,
  normalizePaymentFailureSource,
  readSingleValue,
} from '@/lib/paymentOutcome';

interface PaymentFailPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const resolvedSearchParams = await searchParams;
  const orderId = readSingleValue(resolvedSearchParams.orderId);
  const code = readSingleValue(resolvedSearchParams.code);
  const message = readSingleValue(resolvedSearchParams.message);
  const source = normalizePaymentFailureSource(
    readSingleValue(resolvedSearchParams.source),
  );
  const presentation = describePaymentFailure({ code, message, source });

  if (orderId) {
    await recordLetterPaymentFailure({
      orderId,
      code: presentation.code,
      message: presentation.rawMessage,
      source,
    });
  }

  const iconToneClass =
    presentation.tone === 'neutral'
      ? 'bg-blush-light text-rose-gold'
      : 'bg-red-50 text-rose-gold';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-white/80 border border-blush/40 shadow-soft flex items-center justify-center mb-6">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconToneClass}`}>
          <CircleAlert size={26} />
        </div>
      </div>

      <div className="space-y-3 max-w-sm mb-8" role="alert" aria-live="polite">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-soft-black">
          {presentation.title}
        </h2>
        <p className="text-sm text-warm-gray/70 font-[family-name:var(--font-body)] leading-relaxed">
          {presentation.description}
        </p>
      </div>

      {presentation.code !== 'UNKNOWN' && (
        <p className="text-xs tracking-[0.12em] uppercase text-warm-gray/45 font-[family-name:var(--font-body)] mb-8">
          오류 코드 · {presentation.code}
        </p>
      )}

      <Link
        href="/"
        className="px-7 py-3.5 rounded-2xl bg-rose-gold text-white text-sm font-semibold font-[family-name:var(--font-body)] shadow-soft hover:shadow-float transition-all"
      >
        {presentation.ctaLabel}
      </Link>
    </div>
  );
}
