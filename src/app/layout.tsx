import type { Metadata } from 'next';
import { Playfair_Display, Nunito, Dancing_Script, Nanum_Pen_Script, Gamja_Flower } from 'next/font/google';
import Header from '@/components/layout/Header';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const dancing = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const nanumPen = Nanum_Pen_Script({
  variable: '--font-nanum-pen',
  subsets: ['latin'],
  weight: '400',
});

const gamja = Gamja_Flower({
  variable: '--font-gamja',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Dear Me - 미래의 나에게 보내는 편지',
  description: '미래의 나에게, 혹은 소중한 사람에게 편지를 써보세요. 정해진 날짜에 편지가 전달됩니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${playfair.variable} ${nunito.variable} ${dancing.variable} ${nanumPen.variable} ${gamja.variable}`}
    >
      <body className="min-h-screen bg-cream text-soft-black font-[family-name:var(--font-body)] antialiased">
        <Header />
        <main className="max-w-lg mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
