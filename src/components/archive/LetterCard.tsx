'use client';

import { motion } from 'framer-motion';
import { Lock, LockOpen, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatDisplayDate, daysUntilUnlock } from '@/lib/dates';
import type { Letter } from '@/types/letter';

interface LetterCardProps {
  letter: Letter;
  onClick: () => void;
  index: number;
}

export default function LetterCard({ letter, onClick, index }: LetterCardProps) {
  const isLocked = letter.status === 'sealed';
  const isUnlocked = letter.status === 'unlocked';
  const days = isLocked ? daysUntilUnlock(letter.maturityDate) : 0;
  const isSoon = isLocked && days <= 7 && days > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: 'easeOut' }}
      whileTap={isLocked ? { x: [0, -6, 6, -3, 3, 0] } : {}}
      onClick={onClick}
      className="
        relative bg-white rounded-2xl shadow-card p-5
        cursor-pointer
        transition-shadow duration-200 hover:shadow-float
        overflow-hidden
      "
    >
      {/* Left accent border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
          isUnlocked ? 'bg-sage' : isSoon ? 'bg-blush' : 'bg-lavender'
        }`}
      />

      <div className="flex items-start gap-3 pl-2">
        {/* Icon */}
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5
            ${isUnlocked ? 'bg-sage/20' : isSoon ? 'bg-blush-light' : 'bg-lavender-light'}
          `}
        >
          {isUnlocked ? (
            <LockOpen size={18} className="text-sage-dark" />
          ) : isSoon ? (
            <Sparkles size={18} className="text-rose-gold" />
          ) : (
            <Lock size={18} className="text-warm-gray/60" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-heading)] font-semibold text-soft-black text-[15px] truncate">
            {letter.title}
          </h3>
          <p className="text-[11px] text-warm-gray/60 mt-0.5 font-[family-name:var(--font-body)]">
            Written on {formatDisplayDate(letter.createdAt)}
          </p>
          <div className="mt-2.5">
            {isUnlocked ? (
              <Badge variant="unlocked">Unlocked ✦</Badge>
            ) : isSoon ? (
              <Badge variant="soon">{days}일 후 해금</Badge>
            ) : (
              <Badge variant="locked">
                {formatDisplayDate(letter.maturityDate)} 해금 예정
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
