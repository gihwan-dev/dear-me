'use client';

import React from 'react';
import { Lock, LockOpen, Clock, Sparkles } from 'lucide-react';

type BadgeVariant = 'locked' | 'unlocked' | 'date' | 'soon';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; icon: React.ReactNode }> = {
  locked: {
    bg: 'bg-lavender-light',
    text: 'text-warm-gray',
    icon: <Clock size={12} />,
  },
  unlocked: {
    bg: 'bg-sage/40',
    text: 'text-sage-dark',
    icon: <LockOpen size={12} />,
  },
  date: {
    bg: 'bg-peach-light',
    text: 'text-warm-gray',
    icon: <Clock size={12} />,
  },
  soon: {
    bg: 'bg-blush-light',
    text: 'text-rose-gold',
    icon: <Sparkles size={12} />,
  },
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  const config = variantConfig[variant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full
        text-[11px] font-semibold uppercase tracking-wide
        font-[family-name:var(--font-body)]
        ${config.bg} ${config.text}
        ${className}
      `}
    >
      {config.icon}
      {children}
    </span>
  );
}
