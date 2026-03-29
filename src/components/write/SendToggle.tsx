'use client';

import { Heart, Send } from 'lucide-react';

interface SendToggleProps {
  mode: 'self' | 'send';
  onChange: (mode: 'self' | 'send') => void;
}

export default function SendToggle({ mode, onChange }: SendToggleProps) {
  return (
    <div className="flex gap-2 w-full">
      <button
        onClick={() => onChange('self')}
        className={`
          flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
          text-sm font-semibold font-[family-name:var(--font-body)]
          transition-all duration-200 cursor-pointer
          ${
            mode === 'self'
              ? 'bg-rose-gold text-white shadow-soft'
              : 'bg-white/80 text-warm-gray border border-blush/40 hover:border-rose-gold/40'
          }
        `}
      >
        <Heart size={16} className={mode === 'self' ? 'fill-white' : ''} />
        나에게
      </button>
      <button
        onClick={() => onChange('send')}
        className={`
          flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
          text-sm font-semibold font-[family-name:var(--font-body)]
          transition-all duration-200 cursor-pointer
          ${
            mode === 'send'
              ? 'bg-rose-gold text-white shadow-soft'
              : 'bg-white/80 text-warm-gray border border-blush/40 hover:border-rose-gold/40'
          }
        `}
      >
        <Send size={16} />
        누군가에게
      </button>
    </div>
  );
}
