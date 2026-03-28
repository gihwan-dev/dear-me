import { addMonths, addYears, format, isBefore, parseISO, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { MaturityPeriod } from '@/types/letter';

export function addMaturityPeriod(base: Date, period: MaturityPeriod): Date {
  switch (period) {
    case '3m':
      return addMonths(base, 3);
    case '6m':
      return addMonths(base, 6);
    case '1y':
      return addYears(base, 1);
    default:
      return base;
  }
}

export function isMatured(maturityDate: string): boolean {
  return isBefore(parseISO(maturityDate), new Date());
}

export function formatDisplayDate(iso: string): string {
  return format(parseISO(iso), 'yyyy년 M월 d일', { locale: ko });
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), 'M월 d일, yyyy', { locale: ko });
}

export function formatEnglishDate(iso: string): string {
  return format(parseISO(iso), 'MMMM d, yyyy');
}

export function daysUntilUnlock(maturityDate: string): number {
  return differenceInDays(parseISO(maturityDate), new Date());
}

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function todayFormatted(): string {
  return format(new Date(), 'yyyy년 M월 d일', { locale: ko });
}
