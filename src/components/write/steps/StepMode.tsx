'use client';

import { motion } from 'framer-motion';

interface StepModeProps {
  mode: 'self' | 'send';
  onModeChange: (mode: 'self' | 'send') => void;
}

export default function StepMode({ mode, onModeChange }: StepModeProps) {
  const options = [
    { value: 'self' as const, label: '나에게', desc: '미래의 내가 읽을 편지' },
    { value: 'send' as const, label: '누군가에게', desc: '소중한 사람에게 보내는 편지' },
  ];

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-4 pb-8">
        <h2 className="font-[family-name:var(--font-title-hand)] text-3xl text-soft-black">
          누구에게 보낼까요?
        </h2>
      </div>

      <div className="space-y-3 flex-1">
        {options.map(({ value, label, desc }) => (
          <motion.button
            key={value}
            whileTap={{ scale: 0.98 }}
            onClick={() => onModeChange(value)}
            className={`
              w-full py-5 px-5 rounded-2xl text-left transition-all duration-200 cursor-pointer
              ${
                mode === value
                  ? 'bg-rose-gold text-white shadow-soft'
                  : 'bg-white/80 text-soft-black border border-blush/30 hover:border-rose-gold/40'
              }
            `}
          >
            <span className="text-base font-semibold font-[family-name:var(--font-body)] block">
              {label}
            </span>
            <span
              className={`text-xs mt-1 block font-[family-name:var(--font-body)] ${
                mode === value ? 'text-white/70' : 'text-warm-gray/50'
              }`}
            >
              {desc}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
