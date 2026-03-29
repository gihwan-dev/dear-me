'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Clock, ArrowRight } from 'lucide-react';
import Sparkles from '@/components/ui/Sparkles';
import { formatDisplayDate } from '@/lib/dates';
import type { SendLetter, SendLetterRow } from '@/types/letter';
import { rowToSendLetter } from '@/types/letter';
import { createBrowserClient } from '@/lib/supabase';

interface SendConfirmationProps {
  sendId: string;
}

export default function SendConfirmation({ sendId }: SendConfirmationProps) {
  const router = useRouter();
  const [letter, setLetter] = useState<SendLetter | null>(null);

  useEffect(() => {
    async function fetchLetter() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from('letters')
        .select('*')
        .eq('id', sendId)
        .single();

      if (data) {
        setLetter(rowToSendLetter(data as SendLetterRow));
      }
    }
    fetchLetter();
  }, [sendId]);

  if (!letter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-rose-gold/30 border-t-rose-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center text-center py-8 relative"
    >
      <Sparkles count={8} />

      {/* Envelope icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-3xl bg-lavender-light flex items-center justify-center mb-6"
      >
        <Mail size={40} className="text-rose-gold" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-[family-name:var(--font-script)] text-2xl text-soft-black mb-3"
      >
        편지가 봉인되었어요.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-warm-gray/60 font-[family-name:var(--font-body)] leading-relaxed max-w-xs mb-6"
      >
        {letter.isSelfLetter
          ? '미래의 나에게 보내는 소중한 마음이\n시간 속을 여행하고 있어요.'
          : `${letter.recipientName}님에게 보내는 편지가\n시간 속을 여행하고 있어요.`}
      </motion.p>

      {/* Delivery info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/80 rounded-2xl p-5 w-full max-w-xs border border-blush/30 space-y-3 mb-8"
      >
        <div className="flex items-center gap-2 text-sm font-[family-name:var(--font-body)]">
          <span className="text-warm-gray/50">To</span>
          <span className="text-soft-black font-semibold">{letter.recipientName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-[family-name:var(--font-body)]">
          <Clock size={14} className="text-rose-gold/60" />
          <span className="text-warm-gray/70">
            {formatDisplayDate(letter.maturityDate)} 배달 예정
          </span>
        </div>
      </motion.div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blush-light text-rose-gold text-xs font-semibold font-[family-name:var(--font-body)] tracking-wider uppercase mb-6"
      >
        <Clock size={14} />
        미래로 이동 중
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="space-y-3 w-full max-w-xs"
      >
        <button
          onClick={() => router.push('/archive')}
          className="w-full py-3.5 rounded-2xl bg-rose-gold text-white text-sm font-bold font-[family-name:var(--font-body)] flex items-center justify-center gap-2 cursor-pointer shadow-soft hover:shadow-float transition-all"
        >
          보관함으로 <ArrowRight size={16} />
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 text-warm-gray/50 text-xs font-semibold font-[family-name:var(--font-body)] uppercase tracking-wider cursor-pointer hover:text-warm-gray transition-colors"
        >
          새 편지 쓰기
        </button>
      </motion.div>
    </motion.div>
  );
}
