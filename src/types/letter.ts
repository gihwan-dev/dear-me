export type LetterStatus = 'draft' | 'sealed' | 'unlocked';
export type LetterFilter = 'all' | 'locked' | 'unlocked';
export type MaturityPeriod = '3m' | '6m' | '1y' | 'custom';

// Local letter (kept for drafts in localStorage)
export interface Letter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  maturityDate: string;
  status: LetterStatus;
  backgroundGradient: string;
}

export interface AppSettings {
  animationsEnabled: boolean;
}

// --- Send letter (Supabase-backed) ---

export type DeliveryStatus = 'pending' | 'delivered' | 'failed';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface SendLetter {
  id: string;
  viewCode: string;
  title: string;
  content: string;
  senderName: string;
  recipientName: string;
  recipientPhone: string;
  isSelfLetter: boolean;
  createdAt: string;
  maturityDate: string;
  backgroundGradient: string;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  merchantUid: string;
  paymentKey?: string;
  paidAt?: string;
  deliveredAt?: string;
}

// DB row shape (snake_case)
export interface SendLetterRow {
  id: string;
  view_code: string;
  title: string;
  content: string;
  sender_name: string;
  recipient_name: string;
  recipient_phone: string;
  is_self_letter: boolean;
  created_at: string;
  maturity_date: string;
  background_gradient: string;
  delivery_status: DeliveryStatus;
  payment_status: PaymentStatus;
  merchant_uid: string;
  payment_key: string | null;
  paid_at: string | null;
  delivered_at: string | null;
}

// Helper: DB row → camelCase
export function rowToSendLetter(row: SendLetterRow): SendLetter {
  return {
    id: row.id,
    viewCode: row.view_code,
    title: row.title,
    content: row.content,
    senderName: row.sender_name,
    recipientName: row.recipient_name,
    recipientPhone: row.recipient_phone,
    isSelfLetter: row.is_self_letter,
    createdAt: row.created_at,
    maturityDate: row.maturity_date,
    backgroundGradient: row.background_gradient,
    deliveryStatus: row.delivery_status,
    paymentStatus: row.payment_status,
    merchantUid: row.merchant_uid,
    paymentKey: row.payment_key ?? undefined,
    paidAt: row.paid_at ?? undefined,
    deliveredAt: row.delivered_at ?? undefined,
  };
}
