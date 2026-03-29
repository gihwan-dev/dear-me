'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import FunnelProgress from '@/components/write/FunnelProgress';
import StepLanding from '@/components/write/steps/StepLanding';
import StepMode from '@/components/write/steps/StepMode';
import StepSender from '@/components/write/steps/StepSender';
import StepRecipient from '@/components/write/steps/StepRecipient';
import StepPhone from '@/components/write/steps/StepPhone';
import StepLetter from '@/components/write/steps/StepLetter';
import StepDelivery from '@/components/write/steps/StepDelivery';
import { addMaturityPeriod, toISOString } from '@/lib/dates';
import { letterStyles } from '@/lib/letterStyles';
import {
  LETTER_ORDER_NAME,
  LETTER_PRICE,
  LETTER_PRICE_LABEL,
} from '@/lib/paymentConstants';
import type { MaturityPeriod } from '@/types/letter';

// Step identifiers — order depends on mode
type StepId = 'landing' | 'mode' | 'sender' | 'recipient' | 'phone' | 'letter' | 'delivery';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function WritePage() {
  // Funnel state
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Letter content
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<MaturityPeriod>('6m');
  const [customDate, setCustomDate] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(letterStyles[0].key);

  // Send mode
  const [mode, setMode] = useState<'self' | 'send'>('self');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Dynamic steps based on mode
  const steps: StepId[] = useMemo(() => {
    const base: StepId[] = ['landing', 'mode', 'sender'];
    if (mode === 'send') base.push('recipient');
    base.push('phone', 'letter', 'delivery');
    return base;
  }, [mode]);

  const currentStep = steps[stepIndex];
  const totalFormSteps = steps.length - 1; // exclude landing
  const formStepIndex = stepIndex; // landing = 0, rest = 1..N

  const computeMaturityDate = useCallback(() => {
    if (selectedPeriod === 'custom') return customDate;
    return toISOString(addMaturityPeriod(new Date(), selectedPeriod));
  }, [selectedPeriod, customDate]);

  // Step validation
  const isStepValid = (id: StepId): boolean => {
    switch (id) {
      case 'landing':
        return true;
      case 'mode':
        return true; // always valid, selection auto-advances or "다음" works
      case 'sender':
        return !!senderName.trim();
      case 'recipient':
        return !!recipientName.trim();
      case 'phone':
        return recipientPhone.replace(/-/g, '').length >= 10;
      case 'letter':
        return !!title.trim() && !!content.trim();
      case 'delivery':
        return !!computeMaturityDate();
      default:
        return false;
    }
  };

  const goNext = () => {
    if (stepIndex < steps.length - 1 && isStepValid(currentStep)) {
      setDirection(1);
      setError('');
      setStepIndex((s) => s + 1);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setDirection(-1);
      setError('');
      // When going back from phone step and we're in self mode,
      // we need to skip recipient step which doesn't exist
      setStepIndex((s) => s - 1);
    }
  };

  // Payment flow
  const handlePaymentRequest = async () => {
    if (!isStepValid('delivery')) return;

    setIsLoading(true);
    setError('');

    const maturityDate = computeMaturityDate();
    const isSelf = mode === 'self';
    const finalRecipientName = isSelf ? senderName : recipientName;

    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          senderName,
          recipientName: finalRecipientName,
          recipientPhone,
          isSelfLetter: isSelf,
          maturityDate,
          backgroundGradient: selectedStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const { ANONYMOUS, loadTossPayments } = await import(
        '@tosspayments/tosspayments-sdk'
      );
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      await widgets.requestPaymentWindow({
        amount: {
          currency: 'KRW',
          value: data.paymentAmount ?? LETTER_PRICE,
        },
        orderId: data.merchantUid,
        orderName: LETTER_ORDER_NAME,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerName: senderName.trim(),
        customerMobilePhone: recipientPhone.replace(/\D/g, ''),
      });
    } catch (err) {
      const errorCode =
        err &&
        typeof err === 'object' &&
        'code' in err &&
        typeof err.code === 'string'
          ? err.code
          : '';
      const errorName =
        err instanceof Error
          ? err.name
          : '';

      if (
        errorCode.includes('CANCEL') ||
        errorName === 'UserCancelError'
      ) {
        setIsLoading(false);
        return;
      }
      console.error('Payment request failed:', err);
      setError('결제 요청 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSelf = mode === 'self';
  const isLanding = currentStep === 'landing';
  const isLastStep = currentStep === 'delivery';

  return (
    <div className="flex flex-col h-[calc(100dvh-56px)] overflow-hidden">
      {/* Progress bar + Back button (hidden on landing) */}
      {!isLanding && (
        <FunnelProgress
          step={formStepIndex}
          totalSteps={totalFormSteps}
          onBack={goBack}
        />
      )}

      {/* Step content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={isLanding ? undefined : slideVariants}
            initial={isLanding ? { opacity: 0 } : 'enter'}
            animate={isLanding ? { opacity: 1 } : 'center'}
            exit={isLanding ? { opacity: 0 } : 'exit'}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {currentStep === 'landing' && (
              <StepLanding />
            )}
            {currentStep === 'mode' && (
              <StepMode mode={mode} onModeChange={setMode} />
            )}
            {currentStep === 'sender' && (
              <StepSender
                senderName={senderName}
                onSenderNameChange={setSenderName}
                onAdvance={goNext}
              />
            )}
            {currentStep === 'recipient' && (
              <StepRecipient
                recipientName={recipientName}
                onRecipientNameChange={setRecipientName}
                onRecipientPhoneChange={setRecipientPhone}
                onAdvance={goNext}
              />
            )}
            {currentStep === 'phone' && (
              <StepPhone
                recipientPhone={recipientPhone}
                isSelfLetter={isSelf}
                onRecipientPhoneChange={setRecipientPhone}
                onAdvance={goNext}
              />
            )}
            {currentStep === 'letter' && (
              <StepLetter
                title={title}
                content={content}
                selectedStyle={selectedStyle}
                senderName={senderName}
                recipientName={isSelf ? senderName : recipientName}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onStyleChange={setSelectedStyle}
              />
            )}
            {currentStep === 'delivery' && (
              <StepDelivery
                selectedPeriod={selectedPeriod}
                customDate={customDate}
                onPeriodChange={setSelectedPeriod}
                onCustomDateChange={setCustomDate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-rose-gold text-center font-[family-name:var(--font-body)] px-5 pb-2"
        >
          {error}
        </motion.p>
      )}

      {/* Bottom fixed button — always visible, same position */}
      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {isLastStep ? (
          <button
            onClick={handlePaymentRequest}
            disabled={isLoading || !isStepValid('delivery')}
            className={`
              w-full py-4 rounded-2xl text-base font-semibold font-[family-name:var(--font-body)]
              transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
              ${
                isLoading || !isStepValid('delivery')
                  ? 'bg-warm-gray/15 text-warm-gray/40 cursor-not-allowed'
                  : 'bg-rose-gold text-white shadow-soft active:scale-[0.98]'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                결제 처리 중...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                편지 보내기 ({LETTER_PRICE_LABEL})
              </>
            )}
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!isStepValid(currentStep)}
            className={`
              w-full py-4 rounded-2xl text-base font-semibold font-[family-name:var(--font-body)]
              transition-all duration-200 cursor-pointer
              ${
                isStepValid(currentStep)
                  ? 'bg-rose-gold text-white shadow-soft active:scale-[0.98]'
                  : 'bg-warm-gray/15 text-warm-gray/40 cursor-not-allowed'
              }
            `}
          >
            {isLanding ? '편지 쓰기' : '다음'}
          </button>
        )}
      </div>
    </div>
  );
}
