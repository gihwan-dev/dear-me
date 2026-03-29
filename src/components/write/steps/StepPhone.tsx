'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone } from 'lucide-react';

interface StepPhoneProps {
  recipientPhone: string;
  isSelfLetter: boolean;
  onRecipientPhoneChange: (v: string) => void;
}

function formatPhone(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export default function StepPhone({
  recipientPhone,
  isSelfLetter,
  onRecipientPhoneChange,
}: StepPhoneProps) {
  const phoneRef = useRef<HTMLInputElement>(null);
  const [phoneRaw, setPhoneRaw] = useState(formatPhone(recipientPhone));

  useEffect(() => {
    const timer = setTimeout(() => phoneRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9-]/g, '');
    const formatted = formatPhone(raw);
    setPhoneRaw(formatted);
    onRecipientPhoneChange(formatted.replace(/-/g, ''));
  };

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-14 pb-6">
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
              placeholder="010-0000-0000"
              maxLength={13}
              className="w-full bg-transparent text-soft-black text-lg font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30 tracking-wide"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
