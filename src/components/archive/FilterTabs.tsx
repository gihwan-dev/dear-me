'use client';

import Button, { activePillClass } from '@/components/ui/Button';
import type { LetterFilter } from '@/types/letter';

interface FilterTabsProps {
  activeFilter: LetterFilter;
  onFilterChange: (filter: LetterFilter) => void;
}

const filters: { value: LetterFilter; label: string }[] = [
  { value: 'all', label: 'All Letters' },
  { value: 'locked', label: 'Locked' },
  { value: 'unlocked', label: 'Unlocked' },
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
