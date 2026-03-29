'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { LETTER_PRICE_LABEL } from '@/lib/paymentConstants';

interface PaymentButtonProps {
  disabled?: boolean;
  onPaymentRequest: () => Promise<void>;
}

export default function PaymentButton({ disabled, onPaymentRequest }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onPaymentRequest();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        w-full py-4 rounded-2xl
        flex items-center justify-center gap-2.5
        text-base font-bold
        font-[family-name:var(--font-body)]
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          loading
            ? 'bg-warm-gray/20 text-warm-gray'
            : 'bg-rose-gold text-white shadow-soft hover:shadow-float active:shadow-none'
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          결제 처리 중...
        </>
      ) : (
        <>
          <CreditCard size={20} />
          편지 보내기 ({LETTER_PRICE_LABEL})
        </>
      )}
    </motion.button>
  );
}
