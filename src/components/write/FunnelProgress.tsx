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
    <div className="relative">
      {/* Progress bar */}
      <div className="h-[3px] bg-blush/30 w-full">
        <motion.div
          className="h-full bg-rose-gold"
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* Back button */}
      {step > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          onClick={onBack}
          className="absolute top-4 left-1 flex items-center gap-1 text-warm-gray text-sm font-[family-name:var(--font-body)] cursor-pointer hover:text-rose-gold transition-colors"
        >
          <ChevronLeft size={20} />
          <span>이전</span>
        </motion.button>
      )}
    </div>
  );
}
