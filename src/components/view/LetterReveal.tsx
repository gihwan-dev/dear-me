'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayDate } from '@/lib/dates';
import Sparkles from '@/components/ui/Sparkles';

interface LetterRevealProps {
  title: string;
  content: string;
  senderName: string;
  recipientName: string;
  createdAt: string;
  backgroundGradient: string;
}

export default function LetterReveal({
  title,
  content,
  senderName,
  recipientName,
  createdAt,
  backgroundGradient,
}: LetterRevealProps) {
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center relative"
      >
        <Sparkles count={6} />

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8 cursor-pointer"
          onClick={() => setOpened(true)}
        >
          {/* Envelope SVG */}
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            <rect x="5" y="20" width="110" height="75" rx="8" fill="#FFF8F0" stroke="#D4A89A" strokeWidth="1.5" />
            <path d="M5 28 L60 65 L115 28" stroke="#D4A89A" strokeWidth="1.5" fill="none" />
            <path d="M5 95 L45 60" stroke="#E8D5F5" strokeWidth="0.8" />
            <path d="M115 95 L75 60" stroke="#E8D5F5" strokeWidth="0.8" />
            {/* Heart seal */}
            <circle cx="60" cy="20" r="14" fill="#D4A89A" />
            <path d="M54 18 Q54 14 57 14 Q60 14 60 18 Q60 14 63 14 Q66 14 66 18 Q66 22 60 26 Q54 22 54 18Z" fill="white" />
          </svg>
        </motion.div>

        <h2 className="font-[family-name:var(--font-script)] text-2xl text-soft-black mb-3">
          {recipientName}님에게 편지가 왔어요
        </h2>
        <p className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] mb-8">
          봉투를 탭하면 편지가 열려요
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpened(true)}
          className="px-8 py-3.5 rounded-2xl bg-rose-gold text-white text-sm font-bold font-[family-name:var(--font-body)] shadow-soft cursor-pointer"
        >
          편지 열기
        </motion.button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="py-4 relative"
      >
        <Sparkles count={5} />

        {/* Dear {recipientName} header */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-rose-gold/70 font-[family-name:var(--font-body)] mb-2"
        >
          Dear {recipientName},
        </motion.p>

        {/* Letter card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-3xl p-7 shadow-card relative overflow-hidden min-h-[400px]"
          style={{ background: backgroundGradient }}
        >
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            <h1 className="font-[family-name:var(--font-script)] text-2xl text-soft-black/90 mb-6">
              {title}
            </h1>

            <div className="font-[family-name:var(--font-body)] text-[15px] text-soft-black/80 leading-[1.9] whitespace-pre-wrap">
              {content}
            </div>

            {/* Signature */}
            <div className="mt-10 pt-6 border-t border-soft-black/10">
              <p className="font-[family-name:var(--font-script)] text-lg text-soft-black/70">
                From {senderName}
              </p>
              <p className="text-xs text-soft-black/40 mt-1 font-[family-name:var(--font-body)]">
                {formatDisplayDate(createdAt)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-warm-gray/40 font-[family-name:var(--font-body)]">
            Dear Me에서 전달된 편지예요
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
