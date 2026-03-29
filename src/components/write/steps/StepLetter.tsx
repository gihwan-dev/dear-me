'use client';

import { useEffect, useRef } from 'react';
import LetterStylePicker from '@/components/ui/LetterStylePicker';
import { letterStyles } from '@/lib/letterStyles';

interface StepLetterProps {
  title: string;
  content: string;
  selectedStyle: string;
  senderName: string;
  recipientName: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onStyleChange: (v: string) => void;
}

const LINE_HEIGHT = 32; // px — single source of truth for line spacing

export default function StepLetter({
  title,
  content,
  selectedStyle,
  senderName,
  recipientName,
  onTitleChange,
  onContentChange,
  onStyleChange,
}: StepLetterProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => titleRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const style = letterStyles.find((s) => s.key === selectedStyle) || letterStyles[0];

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-2 pb-3">
        <h2 className="font-[family-name:var(--font-title-hand)] text-3xl text-soft-black">
          마음을 담아 써주세요
        </h2>
      </div>

      {/* Letter style picker */}
      <div className="mb-3">
        <LetterStylePicker selected={selectedStyle} onSelect={onStyleChange} />
      </div>

      {/* Letter paper */}
      <div
        className="flex-1 rounded-xl border-2 shadow-card relative overflow-auto mb-4"
        style={{
          backgroundColor: style.bgColor,
          borderColor: style.lineColor,
          boxShadow: `0 0 0 4px ${style.bgColor}, 0 0 0 5px ${style.lineColor}, 0 6px 24px rgba(212, 168, 154, 0.15), 0 2px 8px rgba(212, 168, 154, 0.08)`,
          ...(style.hasLines
            ? {
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent ${LINE_HEIGHT - 1}px,
                  ${style.lineColor} ${LINE_HEIGHT - 1}px,
                  ${style.lineColor} ${LINE_HEIGHT}px
                )`,
                backgroundPositionY: `${LINE_HEIGHT - 1}px`,
              }
            : {}),
        }}
      >
        {/* Inner padding container — padding-top aligns first text to first line */}
        <div className="px-5 pt-2 pb-4">
          {/* To */}
          <p
            className="font-[family-name:var(--font-handwriting)] opacity-60"
            style={{
              color: style.textColor,
              fontSize: 14,
              lineHeight: `${LINE_HEIGHT}px`,
              height: LINE_HEIGHT,
            }}
          >
            To. {recipientName || '...'}
          </p>

          {/* Title */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="편지 제목"
            autoComplete="off"
            inputMode="text"
            enterKeyHint="next"
            className="w-full bg-transparent border-none outline-none font-semibold font-[family-name:var(--font-title-hand)]"
            style={{
              color: style.textColor,
              fontSize: 20,
              lineHeight: `${LINE_HEIGHT}px`,
              height: LINE_HEIGHT,
              padding: 0,
            }}
          />

          {/* Content */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="마음을 담아 편지를 써보세요..."
            autoComplete="off"
            enterKeyHint="enter"
            className="w-full bg-transparent border-none outline-none resize-none font-[family-name:var(--font-handwriting)]"
            style={{
              color: style.textColor,
              fontSize: 16,
              lineHeight: `${LINE_HEIGHT}px`,
              minHeight: LINE_HEIGHT * 4,
              padding: 0,
            }}
          />

          {/* From — inside the paper */}
          <p
            className="text-right font-[family-name:var(--font-handwriting)] opacity-50 mt-2"
            style={{
              color: style.textColor,
              fontSize: 14,
              lineHeight: `${LINE_HEIGHT}px`,
            }}
          >
            From. {senderName || '...'}
          </p>
        </div>
      </div>
    </div>
  );
}
