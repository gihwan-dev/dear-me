'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface FunnelProgressProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
}

export default function FunnelProgress({ step, totalSteps, onBack }: FunnelProgressProps) {
  return (
    <div className="relative z-10">
      {/* Progress bar */}
      <div className="h-[3px] bg-blush/30 w-full">
        <motion.div
          className="h-full bg-rose-gold"
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* Back button row + step counter */}
      <div className="h-10 flex items-center justify-between px-1">
        <div>
          {step > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="flex items-center gap-1 text-warm-gray text-sm font-[family-name:var(--font-body)] cursor-pointer hover:text-rose-gold transition-colors"
            >
              <ChevronLeft size={20} />
              <span>이전</span>
            </motion.button>
          )}
        </div>
        <span className="text-[11px] text-warm-gray/50 font-[family-name:var(--font-body)] tabular-nums pr-2">
          {step}/{totalSteps}
        </span>
      </div>
    </div>
  );
}
