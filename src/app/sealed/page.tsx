'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import EnvelopeAnimation from '@/components/sealed/EnvelopeAnimation';
import Sparkles from '@/components/ui/Sparkles';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useLetters } from '@/hooks/useLetters';
import { formatDisplayDate } from '@/lib/dates';

function SealedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getLetterById } = useLetters();

  const id = searchParams.get('id');
  const letter = id ? getLetterById(id) : null;

  const handleShare = async () => {
    const text = `I just sealed a letter to my future self with Dear Me. It will be opened on ${
      letter ? formatDisplayDate(letter.maturityDate) : 'a special day'
    }.`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-[70vh] flex flex-col items-center justify-center text-center py-8"
    >
      <Sparkles count={8} />

      {/* Envelope */}
      <div className="mb-8">
        <EnvelopeAnimation />
      </div>

      {/* Message */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="font-[family-name:var(--font-script)] text-3xl text-soft-black mb-4"
      >
        Your letter has been sealed.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="text-warm-gray text-sm leading-relaxed max-w-xs font-[family-name:var(--font-body)] mb-6"
      >
        A whisper to your future self, now traveling through time.
        Quietly resting until its moment of unveiling.
      </motion.p>

      {/* Unlock date */}
      {letter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-sm text-warm-gray/70 mb-2 font-[family-name:var(--font-body)]">
            It will find you again on
          </p>
          <p className="text-lg font-[family-name:var(--font-heading)] font-semibold text-rose-gold">
            {formatDisplayDate(letter.maturityDate)}
          </p>
        </motion.div>
      )}

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.4 }}
        className="space-y-3 w-full max-w-xs"
      >
        <Badge variant="locked" className="mx-auto mb-4">
          In Transit to the Future
        </Badge>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon={<ArrowRight size={18} />}
          onClick={() => router.push('/archive')}
        >
          Return to Archive
        </Button>

        <button
          onClick={handleShare}
          className="text-xs text-warm-gray/50 tracking-[0.15em] uppercase font-semibold font-[family-name:var(--font-body)] hover:text-rose-gold transition-colors mt-4 cursor-pointer"
        >
          Share this moment
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function SealedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-rose-gold/30 border-t-rose-gold rounded-full animate-spin" />
        </div>
      }
    >
      <SealedContent />
    </Suspense>
  );
}
