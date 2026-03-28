'use client';

import { gradientPresets } from '@/lib/gradients';

interface GradientPickerProps {
  selected: string;
  onSelect: (gradient: string) => void;
}

export default function GradientPicker({ selected, onSelect }: GradientPickerProps) {
  return (
    <div className="flex items-center gap-2.5">
      {gradientPresets.map((preset) => (
        <button
          key={preset.key}
          type="button"
          onClick={() => onSelect(preset.value)}
          className={`
            w-8 h-8 rounded-full transition-all duration-200 cursor-pointer
            ${
              selected === preset.value
                ? 'ring-2 ring-rose-gold ring-offset-2 ring-offset-white scale-110'
                : 'hover:scale-105 opacity-80 hover:opacity-100'
            }
          `}
          style={{ background: preset.value }}
          title={preset.label}
        />
      ))}
    </div>
  );
}
