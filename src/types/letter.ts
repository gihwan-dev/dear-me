export type LetterStatus = 'draft' | 'sealed' | 'unlocked';
export type LetterFilter = 'all' | 'locked' | 'unlocked';
export type MaturityPeriod = '3m' | '6m' | '1y' | 'custom';

export interface Letter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  maturityDate: string;
  status: LetterStatus;
  backgroundGradient: string;
}

export interface AppSettings {
  animationsEnabled: boolean;
}
