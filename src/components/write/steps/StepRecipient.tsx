'use client';

import { useEffect, useRef, useState } from 'react';
import { User, BookUser } from 'lucide-react';
import {
  canUseContactPicker,
  selectSingleContact,
} from '@/lib/contactPicker';

interface StepRecipientProps {
  recipientName: string;
  onRecipientNameChange: (v: string) => void;
  onRecipientPhoneChange: (v: string) => void;
  onAdvance: () => void;
}

export default function StepRecipient({
  recipientName,
  onRecipientNameChange,
  onRecipientPhoneChange,
  onAdvance,
}: StepRecipientProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [contactPickerSupported, setContactPickerSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    void canUseContactPicker().then((supported) => {
      if (isMounted) {
        setContactPickerSupported(supported);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContactPicker = async () => {
    try {
      const contact = await selectSingleContact();

      if (!contact) {
        return;
      }

      if (contact.name) {
        onRecipientNameChange(contact.name);
      }

      if (contact.phone) {
        onRecipientPhoneChange(contact.phone);
      }
    } catch {
      // User cancelled
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();

    if (recipientName.trim()) {
      onAdvance();
    }
  };

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-4 pb-8">
        <h2 className="font-[family-name:var(--font-title-hand)] text-3xl text-soft-black">
          누구에게 보낼까요?
        </h2>
        <p className="text-sm text-warm-gray/60 mt-2 font-[family-name:var(--font-body)]">
          편지를 받을 분의 이름을 알려주세요
        </p>
      </div>

      <div className="flex-1">
        <div className="bg-white/80 rounded-2xl p-5 border border-blush/30">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-warm-gray/60 font-semibold font-[family-name:var(--font-body)]">
              받는 사람
            </label>
            {contactPickerSupported ? (
              <button
                type="button"
                onClick={handleContactPicker}
                className="flex items-center gap-1 text-xs text-rose-gold font-semibold font-[family-name:var(--font-body)] cursor-pointer hover:text-rose-gold/80 transition-colors"
              >
                <BookUser size={12} />
                주소록
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <User size={18} className="text-rose-gold/60 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="이름을 입력하세요"
              autoComplete="name"
              inputMode="text"
              enterKeyHint="next"
              className="w-full bg-transparent text-soft-black text-lg font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30"
            />
          </div>
          {contactPickerSupported === false && (
            <p className="mt-3 text-xs text-warm-gray/45 font-[family-name:var(--font-body)]">
              주소록 연동은 지원 브라우저에서만 사용할 수 있어요. 직접 입력해 주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
