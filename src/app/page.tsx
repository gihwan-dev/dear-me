'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WriteCard from '@/components/write/WriteCard';
import MaturityPicker from '@/components/write/MaturityPicker';
import SealButton from '@/components/write/SealButton';
import { useLetters } from '@/hooks/useLetters';
import { addMaturityPeriod, toISOString, todayFormatted } from '@/lib/dates';
import { gradientPresets } from '@/lib/gradients';
import type { MaturityPeriod } from '@/types/letter';

export default function WritePage() {
  const router = useRouter();
  const { createNewLetter, saveDraft } = useLetters();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<MaturityPeriod>('6m');
  const [customDate, setCustomDate] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(gradientPresets[0].value);
  const [isSealing, setIsSealing] = useState(false);
  const [error, setError] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const handleSeal = async () => {
    if (!title.trim()) {
      setError('Please write a title for your letter');
      return;
    }
    if (!content.trim()) {
      setError('Please write something to your future self');
      return;
    }

    setError('');
    setIsSealing(true);

    const maturityDate =
      selectedPeriod === 'custom'
        ? customDate
        : toISOString(addMaturityPeriod(new Date(), selectedPeriod));

    if (!maturityDate) {
      setError('Please select a date');
      setIsSealing(false);
      return;
    }

    // Small delay for animation feel
    await new Promise((r) => setTimeout(r, 800));

    const letter = createNewLetter(title, content, maturityDate, selectedGradient);
    setIsSealing(false);
    router.push(`/sealed?id=${letter.id}`);
  };

  const handleSaveDraft = () => {
    if (!title.trim() && !content.trim()) return;
    saveDraft(title, content, selectedGradient);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
    setTitle('');
    setContent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8 py-2"
    >
      {/* Entry Date */}
      <div className="text-center">
        <p className="text-[11px] text-rose-gold tracking-[0.2em] uppercase font-semibold font-[family-name:var(--font-body)]">
          Entry Date
        </p>
        <p className="text-lg font-[family-name:var(--font-heading)] text-soft-black mt-1">
          {todayFormatted()}
        </p>
      </div>

      {/* Write Card */}
      <WriteCard
        title={title}
        content={content}
        selectedGradient={selectedGradient}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onGradientChange={setSelectedGradient}
      />

      {/* Maturity Picker */}
      <MaturityPicker
        selectedPeriod={selectedPeriod}
        customDate={customDate}
        onPeriodChange={setSelectedPeriod}
        onCustomDateChange={setCustomDate}
      />

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-rose-gold text-center font-[family-name:var(--font-body)]"
        >
          {error}
        </motion.p>
      )}

      {/* Seal Button */}
      <SealButton onClick={handleSeal} isSealing={isSealing} />

      {/* Save as Draft */}
      <div className="text-center">
        <button
          onClick={handleSaveDraft}
          className="text-xs text-warm-gray/60 tracking-[0.15em] uppercase font-semibold font-[family-name:var(--font-body)] hover:text-rose-gold transition-colors cursor-pointer"
        >
          Save as Draft
        </button>
      </div>

      {/* Draft Saved Toast */}
      {showSaved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-sage/90 text-white px-5 py-2.5 rounded-full text-sm font-[family-name:var(--font-body)] shadow-card"
        >
          Draft saved!
        </motion.div>
      )}
    </motion.div>
  );
}
