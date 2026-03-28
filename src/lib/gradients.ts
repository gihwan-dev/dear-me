export interface GradientPreset {
  key: string;
  label: string;
  value: string;
}

export const gradientPresets: GradientPreset[] = [
  {
    key: 'blush-lavender',
    label: 'Blush Lavender',
    value: 'linear-gradient(135deg, #FFD6E0 0%, #E8D5F5 100%)',
  },
  {
    key: 'peach-blush',
    label: 'Peach Blush',
    value: 'linear-gradient(135deg, #FFDAB9 0%, #FFD6E0 100%)',
  },
  {
    key: 'lavender-sage',
    label: 'Lavender Sage',
    value: 'linear-gradient(135deg, #E8D5F5 0%, #D4E7D0 100%)',
  },
  {
    key: 'cream-rose',
    label: 'Cream Rose',
    value: 'linear-gradient(135deg, #FFF8F0 0%, #F0D5CC 100%)',
  },
  {
    key: 'sunset-dream',
    label: 'Sunset Dream',
    value: 'linear-gradient(135deg, #FECDA6 0%, #FF9A9E 50%, #E8D5F5 100%)',
  },
];
