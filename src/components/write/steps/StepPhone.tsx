'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone } from 'lucide-react';
import { formatPhoneNumber, normalizePhoneNumber } from '@/lib/phone';

interface StepPhoneProps {
  recipientPhone: string;
  isSelfLetter: boolean;
  onRecipientPhoneChange: (v: string) => void;
  onAdvance: () => void;
}

export default function StepPhone({
  recipientPhone,
  isSelfLetter,
  onRecipientPhoneChange,
  onAdvance,
}: StepPhoneProps) {
  const phoneRef = useRef<HTMLInputElement>(null);
  const [phoneRaw, setPhoneRaw] = useState(formatPhoneNumber(recipientPhone));

  useEffect(() => {
    const timer = setTimeout(() => phoneRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPhoneRaw(formatPhoneNumber(recipientPhone));
  }, [recipientPhone]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneRaw(formatted);
    onRecipientPhoneChange(normalizePhoneNumber(formatted));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();

    if (normalizePhoneNumber(phoneRaw).length >= 10) {
      onAdvance();
    }
  };

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-4 pb-6">
        <h2 className="font-[family-name:var(--font-title-hand)] text-3xl text-soft-black">
          {isSelfLetter
            ? '편지를 받을 내 번호를\n알려주세요'
            : '편지를 받을 분의 번호를\n알려주세요'}
        </h2>
        <p className="text-sm text-warm-gray/60 mt-2 font-[family-name:var(--font-body)]">
          정해진 날짜에 문자로 편지가 전달돼요
        </p>
      </div>

      <div className="flex-1">
        <div className="bg-white/80 rounded-2xl p-5 border border-blush/30">
          <label className="text-xs text-warm-gray/60 font-semibold font-[family-name:var(--font-body)] mb-2 block">
            {isSelfLetter ? '내 전화번호' : '받는 사람 전화번호'}
          </label>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-rose-gold/60 shrink-0" />
            <input
              ref={phoneRef}
              type="tel"
              value={phoneRaw}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyDown}
              placeholder="010-0000-0000"
              maxLength={13}
              autoComplete="tel-national"
              inputMode="tel"
              enterKeyHint="next"
              className="w-full bg-transparent text-soft-black text-lg font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30 tracking-wide"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
