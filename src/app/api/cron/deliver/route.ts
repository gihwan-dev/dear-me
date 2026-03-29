import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { sendSMS, buildLetterSMS } from '@/lib/solapi';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServerClient();

    // Find paid letters whose maturity date has passed
    const { data: letters, error } = await supabase
      .from('letters')
      .select('*')
      .eq('delivery_status', 'pending')
      .eq('payment_status', 'paid')
      .lte('maturity_date', new Date().toISOString())
      .order('maturity_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Cron query error:', error);
      return NextResponse.json({ error: 'Query failed' }, { status: 500 });
    }

    if (!letters || letters.length === 0) {
      return NextResponse.json({ delivered: 0, message: 'No letters to deliver' });
    }

    let delivered = 0;
    let failed = 0;

    for (const letter of letters) {
      try {
        const smsText = buildLetterSMS(letter.recipient_name, letter.view_code);

        await sendSMS({
          to: letter.recipient_phone,
          text: smsText,
        });

        // Mark as delivered
        await supabase
          .from('letters')
          .update({
            delivery_status: 'delivered',
            delivered_at: new Date().toISOString(),
          })
          .eq('id', letter.id);

        delivered++;
      } catch (sendError) {
        console.error(`Failed to deliver letter ${letter.id}:`, sendError);

        // Mark as failed
        await supabase
          .from('letters')
          .update({ delivery_status: 'failed' })
          .eq('id', letter.id);

        failed++;
      }
    }

    return NextResponse.json({
      delivered,
      failed,
      total: letters.length,
    });
  } catch (err) {
    console.error('Cron delivery error:', err);
    return NextResponse.json({ error: 'Delivery failed' }, { status: 500 });
  }
}
