import type { Letter, AppSettings } from '@/types/letter';

const LETTERS_KEY = 'dear-me-letters';
const SETTINGS_KEY = 'dear-me-settings';

const defaultSettings: AppSettings = {
  animationsEnabled: true,
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getLetters(): Letter[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(LETTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setLetters(letters: Letter[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
}

export function getSettings(): AppSettings {
  if (!isBrowser()) return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function setSettings(settings: AppSettings): void {
  if (!isBrowser()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportAllData(): string {
  return JSON.stringify({
    letters: getLetters(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importAllData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.letters && Array.isArray(data.letters)) {
      setLetters(data.letters);
    }
    if (data.settings) {
      setSettings(data.settings);
    }
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(LETTERS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
