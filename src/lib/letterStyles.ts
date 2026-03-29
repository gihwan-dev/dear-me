export interface LetterStyle {
  key: string;
  label: string;
  bgColor: string;
  lineColor: string;
  textColor: string;
  placeholderColor: string;
  hasLines: boolean;
}

export const letterStyles: LetterStyle[] = [
  {
    key: 'ivory',
    label: '아이보리',
    bgColor: '#FFFDF7',
    lineColor: '#E8DDD3',
    textColor: '#4A3728',
    placeholderColor: '#C4B5A5',
    hasLines: true,
  },
  {
    key: 'pink',
    label: '핑크',
    bgColor: '#FFF0F3',
    lineColor: '#F5D5DC',
    textColor: '#8B4B62',
    placeholderColor: '#D4A0B0',
    hasLines: true,
  },
  {
    key: 'kraft',
    label: '크래프트',
    bgColor: '#F5E6D3',
    lineColor: '#DCC9B0',
    textColor: '#5C4033',
    placeholderColor: '#A08060',
    hasLines: false,
  },
  {
    key: 'lavender',
    label: '라벤더',
    bgColor: '#F3EAFA',
    lineColor: '#DDD0EA',
    textColor: '#5B4980',
    placeholderColor: '#A08DC0',
    hasLines: true,
  },
  {
    key: 'sky',
    label: '하늘',
    bgColor: '#EEF4FF',
    lineColor: '#D0DEF0',
    textColor: '#3B5998',
    placeholderColor: '#8DA8CC',
    hasLines: true,
  },
];
