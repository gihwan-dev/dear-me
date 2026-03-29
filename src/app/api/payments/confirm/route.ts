import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { confirmPayment } from '@/lib/tosspayments';

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || amount == null) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 });
    }

    // 1. Verify amount is 490 to prevent tampering
    if (Number(amount) !== 490) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    // 2. Confirm with Toss Payments
    const result = await confirmPayment({
      paymentKey,
      orderId,
      amount: Number(amount),
    });

    // 3. Update letter in Supabase
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('letters')
      .update({
        payment_status: 'paid',
        payment_key: paymentKey,
        paid_at: result.approvedAt || new Date().toISOString(),
      })
      .eq('merchant_uid', orderId)
      .select('id, view_code')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Payment confirmed but DB update failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      letterId: data.id,
      viewCode: data.view_code,
    });
  } catch (err) {
    console.error('Payment confirm error:', err);
    const message = err instanceof Error ? err.message : 'Payment confirmation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
