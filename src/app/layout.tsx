import type { Metadata } from 'next';
import { Playfair_Display, Nunito, Dancing_Script } from 'next/font/google';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
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

export const metadata: Metadata = {
  title: 'Dear Me - Letters to My Future Self',
  description: 'Write letters to your future self. Seal them with love, and open them when the time comes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${playfair.variable} ${nunito.variable} ${dancing.variable}`}
    >
      <body className="min-h-screen bg-cream text-soft-black font-[family-name:var(--font-body)] antialiased">
        <Header />
        <main className="max-w-lg mx-auto px-5 pb-24 pt-4">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
