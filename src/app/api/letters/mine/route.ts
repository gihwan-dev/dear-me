import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { SendLetterRow } from '@/types/letter';
import { rowToSendLetter } from '@/types/letter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const supabase = createServerClient();

    // Fetch letters where this phone is the sender (for self-letters)
    // or where they are the sender in general
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .or(`recipient_phone.eq.${cleanPhone}`)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch letters' }, { status: 500 });
    }

    const letters = (data as SendLetterRow[]).map(rowToSendLetter);

    return NextResponse.json({ letters });
  } catch (err) {
    console.error('Fetch letters error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
