'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenLine, Archive, Settings2 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'WRITE', icon: PenLine },
  { href: '/archive', label: 'ARCHIVE', icon: Archive },
  { href: '/settings', label: 'SETTINGS', icon: Settings2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-blush/20 shadow-[0_-2px_12px_rgba(212,168,154,0.08)]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center gap-1 px-4 py-1.5
                transition-colors duration-200
                ${isActive ? 'text-rose-gold' : 'text-warm-gray/50 hover:text-warm-gray'}
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span
                className={`
                  text-[10px] tracking-widest font-[family-name:var(--font-body)]
                  ${isActive ? 'font-bold' : 'font-medium'}
                `}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
