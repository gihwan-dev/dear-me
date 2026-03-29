/**
 * Server-side Toss Payments confirm API.
 * Called from /api/payments/confirm after user completes payment.
 */

interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface TossPaymentResult {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  approvedAt: string;
}

export async function confirmPayment(
  params: ConfirmPaymentParams,
): Promise<TossPaymentResult> {
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encoded = Buffer.from(secretKey + ':').toString('base64');

  const response = await fetch(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Toss confirm failed: ${error.code || response.status} - ${error.message || ''}`,
    );
  }

  return response.json();
}
