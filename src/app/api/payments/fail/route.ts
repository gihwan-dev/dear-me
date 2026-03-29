import { NextResponse } from 'next/server';
import {
  recordLetterPaymentFailure,
} from '@/lib/paymentConfirmation';
import { normalizePaymentFailureSource } from '@/lib/paymentOutcome';

export async function POST(request: Request) {
  try {
    const { orderId, code, message, source } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const result = await recordLetterPaymentFailure({
      orderId,
      code,
      message,
      source: normalizePaymentFailureSource(source, 'sdk'),
    });

    return NextResponse.json({
      success: true,
      stored: result.stored,
      status: result.status,
      code: result.presentation.code,
    });
  } catch (error) {
    console.error('Payment fail error:', error);
    return NextResponse.json({ error: 'Failed to record payment failure' }, { status: 500 });
  }
}
