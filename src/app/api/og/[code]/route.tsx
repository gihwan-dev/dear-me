import { ImageResponse } from 'next/og';
import { createServerClient } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  // Fetch letter data
  const supabase = createServerClient();
  const { data } = await supabase
    .from('letters')
    .select('title, sender_name, recipient_name, background_gradient')
    .eq('view_code', code)
    .single();

  const title = data?.title || 'Dear Me';
  const senderName = data?.sender_name || '';
  const recipientName = data?.recipient_name || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFD6E0, #E8D5F5, #FFF8F0)',
          fontFamily: 'serif',
          padding: '60px',
        }}
      >
        {/* Letter card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '24px',
            padding: '50px 60px',
            maxWidth: '900px',
            width: '100%',
            boxShadow: '0 8px 32px rgba(212, 168, 154, 0.2)',
          }}
        >
          {/* App name */}
          <div
            style={{
              fontSize: '20px',
              color: '#D4A89A',
              letterSpacing: '3px',
              marginBottom: '24px',
            }}
          >
            DEAR ME
          </div>

          {/* To */}
          <div
            style={{
              fontSize: '18px',
              color: '#6B5B6E',
              marginBottom: '8px',
            }}
          >
            To. {recipientName}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '36px',
              color: '#3D2C3E',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: '32px',
              fontStyle: 'italic',
            }}
          >
            {title}
          </div>

          {/* Divider */}
          <div
            style={{
              width: '80px',
              height: '2px',
              background: '#D4A89A',
              marginBottom: '24px',
            }}
          />

          {/* From */}
          <div
            style={{
              fontSize: '16px',
              color: '#6B5B6E',
              fontStyle: 'italic',
            }}
          >
            From {senderName}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
