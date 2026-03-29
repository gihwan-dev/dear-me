'use client';

import Link from 'next/link';
import { Sparkles, Mail } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-blush/20">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-5">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles size={18} className="text-rose-gold" />
          <h1 className="font-[family-name:var(--font-script)] text-2xl text-rose-gold">
            Dear Me
          </h1>
        </Link>
        <Link
          href="/archive"
          className="flex items-center gap-1.5 text-warm-gray/60 hover:text-rose-gold transition-colors"
        >
          <Mail size={20} />
        </Link>
      </div>
    </header>
  );
}
