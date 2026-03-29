import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dear Me - 편지가 도착했어요',
  description: '누군가가 당신을 위해 소중한 마음을 담아 편지를 썼어요.',
};

export default function ViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal layout: no Header, no BottomNav
  return (
    <main className="max-w-lg mx-auto px-5 py-8 min-h-screen">
      {children}
    </main>
  );
}
