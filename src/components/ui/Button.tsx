'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pill';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-rose-gold text-white shadow-soft hover:bg-rose-gold-light hover:text-soft-black active:scale-[0.97]',
  secondary:
    'bg-transparent border border-rose-gold text-rose-gold hover:bg-rose-gold-light/30 active:scale-[0.97]',
  ghost:
    'bg-transparent text-warm-gray hover:text-rose-gold hover:bg-blush-light/50 active:scale-[0.97]',
  pill:
    'bg-white border border-blush text-warm-gray hover:border-rose-gold hover:text-rose-gold active:scale-[0.97] rounded-full!',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const activePillClass = 'bg-rose-gold! text-white! border-rose-gold!';

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-[family-name:var(--font-body)] font-semibold
        rounded-[var(--radius-button)]
        transition-all duration-200 ease-out
        cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export { activePillClass };
