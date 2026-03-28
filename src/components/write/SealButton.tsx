'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface SealButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isSealing?: boolean;
}

export default function SealButton({ onClick, disabled, isSealing }: SealButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isSealing}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="
        w-full py-4 rounded-2xl
        bg-rose-gold text-white
        font-[family-name:var(--font-body)] text-base font-bold
        shadow-soft hover:shadow-float
        transition-shadow duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3
        cursor-pointer
        animate-[glow_2s_ease-in-out_infinite]
      "
    >
      {isSealing ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
        />
      ) : (
        <>
          <Mail size={20} />
          Seal the Letter
        </>
      )}
    </motion.button>
  );
}
