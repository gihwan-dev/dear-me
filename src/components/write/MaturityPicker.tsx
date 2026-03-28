'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button, { activePillClass } from '@/components/ui/Button';
import { addMaturityPeriod, formatDisplayDate, toISOString } from '@/lib/dates';
import type { MaturityPeriod } from '@/types/letter';

interface MaturityPickerProps {
  selectedPeriod: MaturityPeriod;
  customDate: string;
  onPeriodChange: (period: MaturityPeriod) => void;
  onCustomDateChange: (date: string) => void;
}

const periods: { value: MaturityPeriod; label: string }[] = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
];

export default function MaturityPicker({
  selectedPeriod,
  customDate,
  onPeriodChange,
  onCustomDateChange,
}: MaturityPickerProps) {
  const computedDate =
    selectedPeriod === 'custom'
      ? customDate
      : toISOString(addMaturityPeriod(new Date(), selectedPeriod));

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-warm-gray tracking-[0.15em] uppercase font-[family-name:var(--font-body)]">
        Maturity Date
      </h3>

      <div className="flex flex-wrap gap-2">
        {periods.map(({ value, label }) => (
          <Button
            key={value}
            variant="pill"
            size="sm"
            onClick={() => onPeriodChange(value)}
            className={selectedPeriod === value ? activePillClass : ''}
          >
            {label}
          </Button>
        ))}
        <Button
          variant="pill"
          size="sm"
          icon={<Calendar size={14} />}
          onClick={() => onPeriodChange('custom')}
          className={selectedPeriod === 'custom' ? activePillClass : ''}
        >
          Custom
        </Button>
      </div>

      {selectedPeriod === 'custom' && (
        <input
          type="date"
          value={customDate ? customDate.split('T')[0] : ''}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onCustomDateChange(new Date(e.target.value).toISOString())}
          className="
            w-full px-4 py-2.5 rounded-xl border border-blush
            bg-white text-soft-black text-sm
            font-[family-name:var(--font-body)]
            focus:outline-none focus:ring-2 focus:ring-rose-gold/30 focus:border-rose-gold
            transition-all duration-200
          "
        />
      )}

      {computedDate && (
        <p className="text-sm text-warm-gray/70 font-[family-name:var(--font-body)] italic">
          This letter will remain sealed until{' '}
          <span className="text-rose-gold font-medium not-italic">
            {formatDisplayDate(computedDate)}
          </span>
        </p>
      )}
    </div>
  );
}
