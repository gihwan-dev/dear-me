'use client';

import { letterStyles, type LetterStyle } from '@/lib/letterStyles';

interface LetterStylePickerProps {
  selected: string;
  onSelect: (styleKey: string) => void;
}

export default function LetterStylePicker({ selected, onSelect }: LetterStylePickerProps) {
  return (
    <div className="flex items-center gap-3">
      {letterStyles.map((style) => (
        <button
          key={style.key}
          type="button"
          onClick={() => onSelect(style.key)}
          className={`
            w-10 h-10 rounded-lg transition-all duration-200 cursor-pointer border
            ${
              selected === style.key
                ? 'ring-2 ring-rose-gold ring-offset-2 ring-offset-cream scale-110'
                : 'hover:scale-105 opacity-80 hover:opacity-100'
            }
          `}
          style={{
            backgroundColor: style.bgColor,
            borderColor: style.lineColor,
          }}
          title={style.label}
        >
          {style.hasLines && (
            <div className="w-full h-full flex flex-col justify-end gap-[3px] p-1.5 overflow-hidden">
              <div className="w-full h-px" style={{ backgroundColor: style.lineColor }} />
              <div className="w-full h-px" style={{ backgroundColor: style.lineColor }} />
              <div className="w-3/4 h-px" style={{ backgroundColor: style.lineColor }} />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
