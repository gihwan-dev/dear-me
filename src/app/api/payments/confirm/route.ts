import { NextResponse } from 'next/server';
import {
  confirmLetterPayment,
  PaymentConfirmationError,
} from '@/lib/paymentConfirmation';

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || amount == null) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 });
    }

    const result = await confirmLetterPayment({
      paymentKey,
      orderId,
      amount: Number(amount),
    });

    return NextResponse.json({
      success: true,
      letterId: result.letterId,
      viewCode: result.viewCode,
    });
  } catch (err) {
    console.error('Payment confirm error:', err);

    if (err instanceof PaymentConfirmationError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status },
      );
    }

    const message = err instanceof Error ? err.message : 'Payment confirmation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
