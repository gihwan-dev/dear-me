/**
 * Server-side Toss Payments confirm API.
 * Called from the payment confirmation flow after user completes payment.
 */

interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: number;
  idempotencyKey: string;
}

interface TossPaymentResult {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  approvedAt: string;
}

interface TossApiErrorPayload {
  code?: string;
  message?: string;
}

export class TossApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    public readonly rawMessage: string,
  ) {
    super(rawMessage);
    this.name = 'TossApiError';
  }
}

export async function confirmPayment(
  params: ConfirmPaymentParams,
): Promise<TossPaymentResult> {
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encoded = Buffer.from(secretKey + ':').toString('base64');
  const { idempotencyKey, ...body } = params;

  const response = await fetch(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      cache: 'no-store',
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as TossApiErrorPayload | null;
    throw new TossApiError(
      error?.code || 'UNKNOWN',
      response.status,
      error?.message || 'Toss confirm request failed',
    );
  }

  return response.json();
}
