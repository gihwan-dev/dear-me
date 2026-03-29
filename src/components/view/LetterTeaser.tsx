'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Clock } from 'lucide-react';
import { formatDisplayDate, daysUntilUnlock } from '@/lib/dates';
import Sparkles from '@/components/ui/Sparkles';

interface LetterTeaserProps {
  recipientName: string;
  maturityDate: string;
}

export default function LetterTeaser({ recipientName, maturityDate }: LetterTeaserProps) {
  const [days, setDays] = useState(daysUntilUnlock(maturityDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setDays(daysUntilUnlock(maturityDate));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [maturityDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center relative"
    >
      <Sparkles count={6} />

      {/* Locked envelope */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-28 h-28 rounded-3xl bg-lavender-light/80 flex items-center justify-center mb-8"
      >
        <Lock size={40} className="text-warm-gray/50" />
      </motion.div>

      <h2 className="font-[family-name:var(--font-script)] text-2xl text-soft-black mb-3">
        {recipientName}님에게 편지가 있어요
      </h2>

      <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] leading-relaxed max-w-xs mb-8">
        누군가가 소중한 마음을 담아 편지를 썼어요.
        아직은 봉인되어 있지만, 곧 열릴 거예요.
      </p>

      {/* Countdown */}
      <div className="bg-white/80 rounded-2xl p-6 border border-blush/30 w-full max-w-xs mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock size={16} className="text-rose-gold/60" />
          <span className="text-[11px] text-warm-gray/50 uppercase tracking-wider font-semibold font-[family-name:var(--font-body)]">
            해금까지
          </span>
        </div>
        <p className="text-4xl font-[family-name:var(--font-heading)] font-bold text-rose-gold">
          {days}
          <span className="text-lg ml-1">일</span>
        </p>
        <p className="text-xs text-warm-gray/50 mt-2 font-[family-name:var(--font-body)]">
          {formatDisplayDate(maturityDate)}에 열려요
        </p>
      </div>

      <p className="text-xs text-warm-gray/40 font-[family-name:var(--font-body)]">
        Dear Me에서 전달될 편지예요
      </p>
    </motion.div>
  );
}
