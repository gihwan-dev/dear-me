import { createServerClient } from '@/lib/supabase';
import { isMatured } from '@/lib/dates';
import type { SendLetterRow } from '@/types/letter';
import LetterReveal from '@/components/view/LetterReveal';
import LetterTeaser from '@/components/view/LetterTeaser';
import { notFound } from 'next/navigation';

interface ViewPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: ViewPageProps) {
  const { code } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: 'Dear Me - 편지가 도착했어요',
    description: '누군가가 당신을 위해 소중한 마음을 담아 편지를 썼어요.',
    openGraph: {
      title: 'Dear Me - 편지가 도착했어요',
      description: '누군가가 당신을 위해 소중한 마음을 담아 편지를 썼어요.',
      images: [`${baseUrl}/api/og/${code}`],
    },
  };
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { code } = await params;
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('view_code', code)
    .eq('payment_status', 'paid')
    .single();

  if (error || !data) {
    notFound();
  }

  const letter = data as SendLetterRow;
  const matured = isMatured(letter.maturity_date);

  if (matured) {
    return (
      <LetterReveal
        title={letter.title}
        content={letter.content}
        senderName={letter.sender_name}
        recipientName={letter.recipient_name}
        createdAt={letter.created_at}
        backgroundGradient={letter.background_gradient}
      />
    );
  }

  return (
    <LetterTeaser
      recipientName={letter.recipient_name}
      maturityDate={letter.maturity_date}
    />
  );
}
