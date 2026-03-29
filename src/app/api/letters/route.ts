import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateViewCode } from '@/lib/viewCode';
import { LETTER_PRICE } from '@/lib/paymentConstants';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      senderName,
      recipientName,
      recipientPhone,
      isSelfLetter,
      maturityDate,
      backgroundGradient,
    } = body;

    // Validation
    if (!title || !content || !senderName || !recipientName || !recipientPhone || !maturityDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const viewCode = generateViewCode();
    const merchantUid = `dearme_${nanoid(16)}`;

    const { data, error } = await supabase
      .from('letters')
      .insert({
        view_code: viewCode,
        title,
        content,
        sender_name: senderName,
        recipient_name: recipientName,
        recipient_phone: recipientPhone.replace(/[^0-9]/g, ''),
        is_self_letter: isSelfLetter ?? false,
        maturity_date: maturityDate,
        background_gradient: backgroundGradient,
        delivery_status: 'pending',
        payment_status: 'pending',
        merchant_uid: merchantUid,
        payment_amount: LETTER_PRICE,
      })
      .select('id, view_code, merchant_uid, payment_amount')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create letter' }, { status: 500 });
    }

    return NextResponse.json({
      letterId: data.id,
      viewCode: data.view_code,
      merchantUid: data.merchant_uid,
      paymentAmount: data.payment_amount,
    });
  } catch (err) {
    console.error('Letter creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
