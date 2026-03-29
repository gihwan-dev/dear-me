'use client';

import Button, { activePillClass } from '@/components/ui/Button';
import type { LetterFilter } from '@/types/letter';

interface FilterTabsProps {
  activeFilter: LetterFilter;
  onFilterChange: (filter: LetterFilter) => void;
}

const filters: { value: LetterFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'locked', label: '봉인됨' },
  { value: 'unlocked', label: '열림' },
];

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant="pill"
          size="sm"
          onClick={() => onFilterChange(value)}
          className={activeFilter === value ? activePillClass : ''}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
