'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, BookUser } from 'lucide-react';

interface RecipientFormProps {
  senderName: string;
  recipientName: string;
  recipientPhone: string;
  isSelfLetter: boolean;
  onSenderNameChange: (v: string) => void;
  onRecipientNameChange: (v: string) => void;
  onRecipientPhoneChange: (v: string) => void;
}

function formatPhone(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
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
  const [phoneRaw, setPhoneRaw] = useState(recipientPhone);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9-]/g, '');
    const formatted = formatPhone(raw);
    setPhoneRaw(formatted);
    onRecipientPhoneChange(formatted.replace(/-/g, ''));
  };

  const handleContactPicker = async () => {
    try {
      // Contact Picker API
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const contacts = await (navigator as unknown as { contacts: { select: (props: string[], opts: { multiple: boolean }) => Promise<Array<{ name: string[]; tel: string[] }>> } }).contacts.select(
          ['name', 'tel'],
          { multiple: false },
        );
        if (contacts.length > 0) {
          const contact = contacts[0];
          if (contact.name?.[0]) {
            onRecipientNameChange(contact.name[0]);
          }
          if (contact.tel?.[0]) {
            const phone = contact.tel[0].replace(/[^0-9]/g, '');
            const formatted = formatPhone(phone);
            setPhoneRaw(formatted);
            onRecipientPhoneChange(phone);
          }
        }
      } else {
        alert('이 브라우저에서는 연락처 선택이 지원되지 않아요.\n직접 입력해주세요.');
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
            <button
              onClick={handleContactPicker}
              className="flex items-center gap-1 text-[11px] text-rose-gold font-semibold font-[family-name:var(--font-body)] cursor-pointer hover:text-rose-gold/80 transition-colors"
            >
              <BookUser size={12} />
              주소록
            </button>
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
