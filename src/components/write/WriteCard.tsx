'use client';

import { useRef, useEffect } from 'react';
import GradientPicker from '@/components/ui/GradientPicker';

interface WriteCardProps {
  title: string;
  content: string;
  selectedGradient: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onGradientChange: (gradient: string) => void;
}

export default function WriteCard({
  title,
  content,
  selectedGradient,
  onTitleChange,
  onContentChange,
  onGradientChange,
}: WriteCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative animate-[float_3s_ease-in-out_infinite]">
      <div
        className="rounded-2xl p-6 shadow-card min-h-[360px] flex flex-col relative overflow-hidden"
        style={{ background: selectedGradient }}
      >
        {/* Decorative corner sparkles */}
        <div className="absolute top-3 right-3 opacity-30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
          </svg>
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
          </svg>
        </div>

        {/* Gradient Picker */}
        <div className="mb-4">
          <GradientPicker selected={selectedGradient} onSelect={onGradientChange} />
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Title of your journal..."
          className="
            w-full bg-transparent border-none outline-none
            font-[family-name:var(--font-heading)] text-xl font-semibold
            text-white/90 placeholder:text-white/40
            mb-3
          "
        />

        {/* Divider */}
        <div className="w-16 h-px bg-white/30 mb-4" />

        {/* Content Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Speak to your future self...&#10;What do you want to remember?"
          className="
            w-full bg-transparent border-none outline-none resize-none
            font-[family-name:var(--font-body)] text-[15px] leading-relaxed
            text-white/80 placeholder:text-white/35
            flex-1 min-h-[200px]
          "
        />
      </div>
    </div>
  );
}
