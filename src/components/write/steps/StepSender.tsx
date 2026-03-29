'use client';

import { useEffect, useRef } from 'react';
import { User } from 'lucide-react';

interface StepSenderProps {
  senderName: string;
  onSenderNameChange: (v: string) => void;
}

export default function StepSender({
  senderName,
  onSenderNameChange,
}: StepSenderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-14 pb-8">
        <h2 className="font-[family-name:var(--font-title-hand)] text-3xl text-soft-black">
          보내는 사람은 누구인가요?
        </h2>
        <p className="text-sm text-warm-gray/60 mt-2 font-[family-name:var(--font-body)]">
          편지에 이름이 함께 전달돼요
        </p>
      </div>

      <div className="flex-1">
        <div className="bg-white/80 rounded-2xl p-5 border border-blush/30">
          <label className="text-xs text-warm-gray/60 font-semibold font-[family-name:var(--font-body)] mb-2 block">
            보내는 사람
          </label>
          <div className="flex items-center gap-3">
            <User size={18} className="text-rose-gold/60 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={senderName}
              onChange={(e) => onSenderNameChange(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full bg-transparent text-soft-black text-lg font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
