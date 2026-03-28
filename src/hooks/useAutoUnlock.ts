'use client';

import { useEffect, useRef } from 'react';
import { useLetters } from './useLetters';
import { isMatured } from '@/lib/dates';

export function useAutoUnlock() {
  const { letters, updateLetter } = useLetters();
  const processedRef = useRef(false);

  useEffect(() => {
    const checkAndUnlock = () => {
      letters.forEach((letter) => {
        if (letter.status === 'sealed' && letter.maturityDate && isMatured(letter.maturityDate)) {
          updateLetter(letter.id, { status: 'unlocked' });
        }
      });
    };

    checkAndUnlock();

    const interval = setInterval(checkAndUnlock, 60000);
    return () => clearInterval(interval);
  }, [letters, updateLetter]);
}
