'use client';

import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-blush/20">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-rose-gold" />
          <h1 className="font-[family-name:var(--font-script)] text-2xl text-rose-gold">
            Dear Me
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-warm-gray/60 font-[family-name:var(--font-body)]">
            with love
          </span>
          <span className="text-rose-gold">&#10084;</span>
        </div>
      </div>
    </header>
  );
}
