'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Header() {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Full reload to reset funnel state
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-blush/20">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-5">
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2">
          <Image
            src="/images/optimized/logo.webp"
            alt="Dear Me"
            width={28}
            height={28}
            unoptimized
            className="w-7 h-7"
          />
          <h1 className="font-[family-name:var(--font-script)] text-2xl text-rose-gold">
            Dear Me
          </h1>
        </a>
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
