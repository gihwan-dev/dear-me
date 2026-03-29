'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import WriteCard from '@/components/write/WriteCard';
import MaturityPicker from '@/components/write/MaturityPicker';
import SealButton from '@/components/write/SealButton';
import SendToggle from '@/components/write/SendToggle';
import RecipientForm from '@/components/write/RecipientForm';
import PaymentButton from '@/components/write/PaymentButton';
import { useLetters } from '@/hooks/useLetters';
import { addMaturityPeriod, toISOString, todayFormatted } from '@/lib/dates';
import { gradientPresets } from '@/lib/gradients';
import type { MaturityPeriod } from '@/types/letter';

export default function WritePage() {
  const router = useRouter();
  const { createNewLetter, saveDraft } = useLetters();

  // Letter content
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<MaturityPeriod>('6m');
  const [customDate, setCustomDate] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(gradientPresets[0].value);

  // Send mode
  const [mode, setMode] = useState<'self' | 'send'>('self');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // UI state
  const [isSealing, setIsSealing] = useState(false);
  const [error, setError] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const computeMaturityDate = useCallback(() => {
    if (selectedPeriod === 'custom') return customDate;
    return toISOString(addMaturityPeriod(new Date(), selectedPeriod));
  }, [selectedPeriod, customDate]);

  const validate = (): boolean => {
    if (!title.trim()) {
      setError('편지 제목을 써주세요');
      return false;
    }
    if (!content.trim()) {
      setError('편지 내용을 써주세요');
      return false;
    }
    if (!senderName.trim()) {
      setError('보내는 사람 이름을 입력해주세요');
      return false;
    }
    if (mode === 'send' && !recipientName.trim()) {
      setError('받는 사람 이름을 입력해주세요');
      return false;
    }
    if (!recipientPhone || recipientPhone.length < 10) {
      setError('전화번호를 입력해주세요');
      return false;
    }
    const maturityDate = computeMaturityDate();
    if (!maturityDate) {
      setError('날짜를 선택해주세요');
      return false;
    }
    setError('');
    return true;
  };

  // Payment flow — create letter in Supabase, then open Toss payment
  const handlePaymentRequest = async () => {
    if (!validate()) return;

    const maturityDate = computeMaturityDate();
    const isSelf = mode === 'self';
    const finalRecipientName = isSelf ? senderName : recipientName;

    try {
      // 1. Create letter in Supabase
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
          backgroundGradient: selectedGradient,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Load Toss Payment Widget and request payment
      const { loadPaymentWidget } = await import(
        '@tosspayments/payment-widget-sdk'
      );
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
      const paymentWidget = await loadPaymentWidget(clientKey, 'ANONYMOUS');

      await paymentWidget.requestPayment({
        orderId: data.merchantUid,
        orderName: 'Dear Me - 편지 배달',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('USER_CANCEL')) {
        // User cancelled payment — do nothing
        return;
      }
      console.error('Payment request failed:', err);
      setError('결제 요청 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  // Legacy seal for local letters (draft → seal without payment, kept for future)
  const handleSeal = async () => {
    if (!title.trim() || !content.trim()) {
      setError('편지 제목과 내용을 모두 써주세요');
      return;
    }
    setError('');
    setIsSealing(true);

    const maturityDate = computeMaturityDate();
    if (!maturityDate) {
      setError('날짜를 선택해주세요');
      setIsSealing(false);
      return;
    }

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
      className="space-y-6 py-2"
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

      {/* Send Mode Toggle */}
      <SendToggle mode={mode} onChange={setMode} />

      {/* Recipient Form */}
      <AnimatePresence mode="wait">
        <RecipientForm
          key={mode}
          senderName={senderName}
          recipientName={recipientName}
          recipientPhone={recipientPhone}
          isSelfLetter={mode === 'self'}
          onSenderNameChange={setSenderName}
          onRecipientNameChange={setRecipientName}
          onRecipientPhoneChange={setRecipientPhone}
        />
      </AnimatePresence>

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

      {/* Payment / Seal Button */}
      <PaymentButton
        onPaymentRequest={handlePaymentRequest}
        disabled={isSealing}
      />

      {/* Save as Draft */}
      <div className="text-center">
        <button
          onClick={handleSaveDraft}
          className="text-xs text-warm-gray/60 tracking-[0.15em] uppercase font-semibold font-[family-name:var(--font-body)] hover:text-rose-gold transition-colors cursor-pointer"
        >
          임시 저장
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
          임시 저장 완료!
        </motion.div>
      )}
    </motion.div>
  );
}
