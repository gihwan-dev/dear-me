'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, LockOpen } from 'lucide-react';
import Sparkles from '@/components/ui/Sparkles';
import { useLetters } from '@/hooks/useLetters';
import { formatDisplayDate } from '@/lib/dates';

export default function LetterReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getLetterById } = useLetters();

  const letter = getLetterById(id);

  if (!letter || letter.status === 'sealed') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-warm-gray font-[family-name:var(--font-body)]">
          아직 열 수 없는 편지예요.
        </p>
        <button
          onClick={() => router.push('/archive')}
          className="mt-4 text-rose-gold font-semibold text-sm cursor-pointer"
        >
          보관함으로
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-2 px-5 space-y-6"
    >
      {/* Back button */}
      <button
        onClick={() => router.push('/archive')}
        className="flex items-center gap-1 text-warm-gray hover:text-rose-gold transition-colors cursor-pointer"
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-[family-name:var(--font-body)]">보관함</span>
      </button>

      {/* Letter Card */}
      <div className="relative">
        <Sparkles count={5} />
        <div
          className="rounded-2xl p-8 shadow-card min-h-[400px] relative"
          style={{ background: letter.backgroundGradient }}
        >
          {/* Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white/90 mb-2">
            {letter.title}
          </h1>

          {/* Date */}
          <p className="text-xs text-white/50 font-[family-name:var(--font-body)] mb-6">
            {formatDisplayDate(letter.createdAt)} 작성
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-white/30 mb-6" />

          {/* Content */}
          <div className="text-white/80 font-[family-name:var(--font-body)] text-[15px] leading-[1.8] whitespace-pre-wrap">
            {letter.content}
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-2 text-xs text-warm-gray/50 font-[family-name:var(--font-body)]">
          <Calendar size={14} />
          {formatDisplayDate(letter.createdAt)} 봉인
        </div>
        <div className="flex items-center gap-2 text-xs text-sage-dark font-[family-name:var(--font-body)]">
          <LockOpen size={14} />
          {formatDisplayDate(letter.maturityDate)} 열림
        </div>
      </div>
    </motion.div>
  );
}
