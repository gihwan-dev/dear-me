'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface StepLandingProps {
  onStart: () => void;
}

export default function StepLanding({ onStart }: StepLandingProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Content — centered vertically in available space */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Illustration placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-48 h-48 rounded-3xl bg-blush-light/60 flex items-center justify-center mb-8"
        >
          <div className="relative">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#D4A89A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 4l10 8 10-8" />
            </svg>
            <Sparkles size={20} className="text-rose-gold absolute -top-2 -right-3 opacity-60" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-[family-name:var(--font-script)] text-4xl text-rose-gold mb-3"
        >
          Dear Me
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-sm text-warm-gray/70 font-[family-name:var(--font-body)] leading-relaxed max-w-[260px]"
        >
          미래의 나에게, 혹은 소중한 사람에게<br />
          마음을 담은 편지를 보내보세요
        </motion.p>
      </div>

      {/* Button — pinned to bottom, same position as "다음" button */}
      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="
            w-full py-4 rounded-2xl
            bg-rose-gold text-white text-base font-semibold
            font-[family-name:var(--font-body)]
            shadow-soft cursor-pointer
            active:scale-[0.98] transition-all
          "
        >
          편지 쓰기
        </motion.button>
      </div>
    </div>
  );
}
