'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import Sparkles from '@/components/ui/Sparkles';

export default function EmptyState() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center text-center py-16"
    >
      <Sparkles count={5} />

      {/* Envelope illustration */}
      <div className="w-20 h-20 rounded-2xl bg-lavender-light flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4A89A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 4l10 8 10-8" />
        </svg>
      </div>

      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-soft-black mb-2">
        아직 편지가 없어요
      </h3>
      <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] mb-6 max-w-xs">
        미래의 나에게 첫 편지를 써보세요.
        당신의 마음이 시간을 건너 전달될 거예요.
      </p>

      <button
        onClick={() => router.push('/')}
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-[var(--radius-button)]
          bg-rose-gold text-white text-sm font-semibold
          font-[family-name:var(--font-body)]
          shadow-soft hover:shadow-float
          transition-all duration-200 cursor-pointer
          active:scale-[0.97]
        "
      >
        <PenLine size={16} />
        편지 쓰기
      </button>
    </motion.div>
  );
}
