-- Dear Me: Letters delivery table
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_code VARCHAR(16) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  is_self_letter BOOLEAN NOT NULL DEFAULT false,
  maturity_date TIMESTAMPTZ NOT NULL,
  background_gradient TEXT NOT NULL,
  delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'delivered', 'failed')),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed')),
  merchant_uid VARCHAR(100) UNIQUE NOT NULL,
  payment_key VARCHAR(200),
  paid_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for cron delivery: find paid letters that are due
CREATE INDEX idx_pending_delivery ON letters (maturity_date)
  WHERE delivery_status = 'pending' AND payment_status = 'paid';

-- Index for recipient view page lookup
CREATE INDEX idx_view_code ON letters (view_code);

-- Index for archive: find letters by sender phone
CREATE INDEX idx_sender_phone ON letters (recipient_phone, created_at DESC)
  WHERE is_self_letter = true;
