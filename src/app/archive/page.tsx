'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import FilterTabs from '@/components/archive/FilterTabs';
import LetterCard from '@/components/archive/LetterCard';
import EmptyState from '@/components/archive/EmptyState';
import { useLetters } from '@/hooks/useLetters';
import { useAutoUnlock } from '@/hooks/useAutoUnlock';
import type { LetterFilter } from '@/types/letter';

export default function ArchivePage() {
  const router = useRouter();
  const { filteredLetters } = useLetters();
  const [filter, setFilter] = useState<LetterFilter>('all');

  useAutoUnlock();

  const letters = filteredLetters(filter);

  const handleLetterClick = (letter: { id: string; status: string }) => {
    if (letter.status === 'unlocked') {
      router.push(`/letter/${letter.id}`);
    }
    // Locked letters: shake animation handled inside LetterCard
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="py-2 px-5 space-y-0"
    >
      {/* Header + New Letter */}
      <div className="pb-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-title-hand)] text-2xl text-soft-black">
              시간 여행 중인 편지들
            </h2>
            <p className="text-sm text-warm-gray/70 mt-1.5 font-[family-name:var(--font-body)] leading-relaxed">
              마음을 담은 편지가 전달될 날을 기다리고 있어요.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="
              inline-flex items-center gap-1.5 shrink-0
              px-4 py-2 rounded-full
              border border-rose-gold text-rose-gold text-xs font-semibold
              font-[family-name:var(--font-body)]
              bg-transparent hover:bg-rose-gold-light/30
              transition-all duration-200 cursor-pointer
              active:scale-[0.97]
            "
          >
            <PenLine size={14} />
            새 편지
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="pb-4">
        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* Letter List */}
      <div className="space-y-3">
        {letters.length === 0 ? (
          <EmptyState />
        ) : (
          letters.map((letter, index) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              onClick={() => handleLetterClick(letter)}
              index={index}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}
