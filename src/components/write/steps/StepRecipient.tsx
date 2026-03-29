'use client';

import { useEffect, useRef } from 'react';
import { User, BookUser } from 'lucide-react';

interface StepRecipientProps {
  recipientName: string;
  onRecipientNameChange: (v: string) => void;
}

export default function StepRecipient({
  recipientName,
  onRecipientNameChange,
}: StepRecipientProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  const handleContactPicker = async () => {
    try {
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const contacts = await (navigator as unknown as { contacts: { select: (props: string[], opts: { multiple: boolean }) => Promise<Array<{ name: string[]; tel: string[] }>> } }).contacts.select(
          ['name', 'tel'],
          { multiple: false },
        );
        if (contacts.length > 0 && contacts[0].name?.[0]) {
          onRecipientNameChange(contacts[0].name[0]);
        }
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-14 pb-8">
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
            <button
              onClick={handleContactPicker}
              className="flex items-center gap-1 text-xs text-rose-gold font-semibold font-[family-name:var(--font-body)] cursor-pointer hover:text-rose-gold/80 transition-colors"
            >
              <BookUser size={12} />
              주소록
            </button>
          </div>
          <div className="flex items-center gap-3">
            <User size={18} className="text-rose-gold/60 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full bg-transparent text-soft-black text-lg font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
