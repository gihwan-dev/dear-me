import crypto from 'crypto';

const API_BASE = 'https://api.solapi.com';

function getAuthHeaders() {
  const apiKey = process.env.SOLAPI_API_KEY!;
  const apiSecret = process.env.SOLAPI_API_SECRET!;
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(date + salt)
    .digest('hex');

  return {
    'Content-Type': 'application/json',
    Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
  };
}

interface SendSMSParams {
  to: string;
  text: string;
}

export async function sendSMS({ to, text }: SendSMSParams) {
  const senderPhone = process.env.SOLAPI_SENDER_PHONE;
  if (!senderPhone) {
    throw new Error('SOLAPI_SENDER_PHONE is not configured');
  }

  const response = await fetch(`${API_BASE}/messages/v4/send`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      message: {
        to,
        from: senderPhone,
        text,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Solapi SMS failed: ${response.status} ${error}`);
  }

  return response.json();
}

/**
 * Build the SMS text for letter delivery.
 */
export function buildLetterSMS(recipientName: string, viewCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dearme.app';
  return `[Dear Me] ${recipientName}님, 편지가 도착했어요.\n지금 열어보세요: ${baseUrl}/view/${viewCode}`;
}
