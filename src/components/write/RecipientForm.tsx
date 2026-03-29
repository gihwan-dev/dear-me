'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, BookUser } from 'lucide-react';
import {
  canUseContactPicker,
  selectSingleContact,
} from '@/lib/contactPicker';
import { formatPhoneNumber, normalizePhoneNumber } from '@/lib/phone';

interface RecipientFormProps {
  senderName: string;
  recipientName: string;
  recipientPhone: string;
  isSelfLetter: boolean;
  onSenderNameChange: (v: string) => void;
  onRecipientNameChange: (v: string) => void;
  onRecipientPhoneChange: (v: string) => void;
}

export default function RecipientForm({
  senderName,
  recipientName,
  recipientPhone,
  isSelfLetter,
  onSenderNameChange,
  onRecipientNameChange,
  onRecipientPhoneChange,
}: RecipientFormProps) {
  const [phoneRaw, setPhoneRaw] = useState(formatPhoneNumber(recipientPhone));
  const [contactPickerSupported, setContactPickerSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setPhoneRaw(formatPhoneNumber(recipientPhone));
  }, [recipientPhone]);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneRaw(formatted);
    onRecipientPhoneChange(normalizePhoneNumber(formatted));
  };

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
        const formatted = formatPhoneNumber(contact.phone);
        setPhoneRaw(formatted);
        onRecipientPhoneChange(contact.phone);
      }
    } catch {
      // User cancelled or API not available
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {/* Sender name */}
      <div className="bg-white/80 rounded-2xl p-4 border border-blush/30">
        <label className="text-[11px] text-warm-gray/60 uppercase tracking-wider font-semibold font-[family-name:var(--font-body)] mb-1.5 block">
          보내는 사람
        </label>
        <div className="flex items-center gap-2">
          <User size={16} className="text-rose-gold/60 shrink-0" />
          <input
            type="text"
            value={senderName}
            onChange={(e) => onSenderNameChange(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full bg-transparent text-soft-black text-sm font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30"
          />
        </div>
      </div>

      {/* Recipient name — only show if not self letter */}
      {!isSelfLetter && (
        <div className="bg-white/80 rounded-2xl p-4 border border-blush/30">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-warm-gray/60 uppercase tracking-wider font-semibold font-[family-name:var(--font-body)]">
              받는 사람
            </label>
            {contactPickerSupported ? (
              <button
                type="button"
                onClick={handleContactPicker}
                className="flex items-center gap-1 text-[11px] text-rose-gold font-semibold font-[family-name:var(--font-body)] cursor-pointer hover:text-rose-gold/80 transition-colors"
              >
                <BookUser size={12} />
                주소록
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-rose-gold/60 shrink-0" />
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="받는 사람 이름"
              className="w-full bg-transparent text-soft-black text-sm font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30"
            />
          </div>
          {contactPickerSupported === false && (
            <p className="mt-2 text-[11px] text-warm-gray/45 font-[family-name:var(--font-body)]">
              주소록 연동은 지원 브라우저에서만 사용할 수 있어요. 직접 입력해 주세요.
            </p>
          )}
        </div>
      )}

      {/* Phone number */}
      <div className="bg-white/80 rounded-2xl p-4 border border-blush/30">
        <label className="text-[11px] text-warm-gray/60 uppercase tracking-wider font-semibold font-[family-name:var(--font-body)] mb-1.5 block">
          {isSelfLetter ? '내 전화번호' : '받는 사람 전화번호'}
        </label>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-rose-gold/60 shrink-0" />
          <input
            type="tel"
            value={phoneRaw}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
            maxLength={13}
            className="w-full bg-transparent text-soft-black text-sm font-[family-name:var(--font-body)] outline-none placeholder:text-warm-gray/30"
          />
        </div>
      </div>
    </motion.div>
  );
}
