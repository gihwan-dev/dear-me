'use client';

import { Calendar } from 'lucide-react';
import Button, { activePillClass } from '@/components/ui/Button';
import { addMaturityPeriod, formatDisplayDate, toISOString } from '@/lib/dates';
import type { MaturityPeriod } from '@/types/letter';

interface StepDeliveryProps {
  selectedPeriod: MaturityPeriod;
  customDate: string;
  onPeriodChange: (period: MaturityPeriod) => void;
  onCustomDateChange: (date: string) => void;
}

const periods: { value: MaturityPeriod; label: string }[] = [
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
];

export default function StepDelivery({
  selectedPeriod,
  customDate,
  onPeriodChange,
  onCustomDateChange,
}: StepDeliveryProps) {
  const computedDate =
    selectedPeriod === 'custom'
      ? customDate
      : toISOString(addMaturityPeriod(new Date(), selectedPeriod));

  return (
    <div className="flex flex-col h-full px-5">
      <div className="pt-4 pb-6">
        <h2 className="font-[family-name:var(--font-title-hand)] text-3xl text-soft-black">
          언제 전달할까요?
        </h2>
        <p className="text-sm text-warm-gray/80 mt-2 font-[family-name:var(--font-body)]">
          편지가 봉인되어 있다가 해당 날짜에 전달돼요
        </p>
      </div>

      <div className="space-y-5 flex-1">
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
            직접 선택
          </Button>
        </div>

        {selectedPeriod === 'custom' && (
          <input
            type="date"
            value={customDate ? customDate.split('T')[0] : ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => onCustomDateChange(new Date(e.target.value).toISOString())}
            className="
              w-full px-4 py-3 rounded-xl border border-blush
              bg-white text-soft-black text-sm
              font-[family-name:var(--font-body)]
              focus:outline-none focus:ring-2 focus:ring-rose-gold/30 focus:border-rose-gold
              transition-all duration-200
            "
          />
        )}

        {computedDate && (
          <div className="bg-white/80 rounded-2xl p-5 border border-blush/30 text-center">
            <p className="text-sm text-warm-gray/70 font-[family-name:var(--font-body)]">
              이 편지는{' '}
              <span className="text-rose-gold font-semibold">
                {formatDisplayDate(computedDate)}
              </span>
              까지 봉인됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
