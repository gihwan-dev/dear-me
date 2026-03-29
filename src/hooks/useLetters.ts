'use client';

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { isMatured } from '@/lib/dates';
import type { Letter, LetterFilter } from '@/types/letter';
import { letterStyles } from '@/lib/letterStyles';

const LETTERS_KEY = 'dear-me-letters';

export function useLetters() {
  const [letters, setLetters] = useLocalStorage<Letter[]>(LETTERS_KEY, []);

  const addLetter = useCallback(
    (data: Omit<Letter, 'id' | 'createdAt' | 'updatedAt'>): Letter => {
      const now = new Date().toISOString();
      const newLetter: Letter = {
        ...data,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      setLetters((prev) => [newLetter, ...prev]);
      return newLetter;
    },
    [setLetters]
  );

  const updateLetter = useCallback(
    (id: string, updates: Partial<Letter>) => {
      setLetters((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
        )
      );
    },
    [setLetters]
  );

  const deleteLetter = useCallback(
    (id: string) => {
      setLetters((prev) => prev.filter((l) => l.id !== id));
    },
    [setLetters]
  );

  const sealLetter = useCallback(
    (id: string) => {
      updateLetter(id, { status: 'sealed' });
    },
    [updateLetter]
  );

  const getLetterById = useCallback(
    (id: string): Letter | undefined => {
      return letters.find((l) => l.id === id);
    },
    [letters]
  );

  const filteredLetters = useCallback(
    (filter: LetterFilter): Letter[] => {
      switch (filter) {
        case 'locked':
          return letters.filter((l) => l.status === 'sealed');
        case 'unlocked':
          return letters.filter((l) => l.status === 'unlocked');
        default:
          return letters.filter((l) => l.status !== 'draft');
      }
    },
    [letters]
  );

  const drafts = letters.filter((l) => l.status === 'draft');

  const createNewLetter = useCallback(
    (title: string, content: string, maturityDate: string, gradient?: string): Letter => {
      return addLetter({
        title,
        content,
        maturityDate,
        status: 'sealed',
        backgroundGradient: gradient || letterStyles[0].key,
      });
    },
    [addLetter]
  );

  const saveDraft = useCallback(
    (title: string, content: string, gradient?: string): Letter => {
      return addLetter({
        title,
        content,
        maturityDate: '',
        status: 'draft',
        backgroundGradient: gradient || letterStyles[0].key,
      });
    },
    [addLetter]
  );

  return {
    letters,
    addLetter,
    updateLetter,
    deleteLetter,
    sealLetter,
    getLetterById,
    filteredLetters,
    drafts,
    createNewLetter,
    saveDraft,
  };
}
