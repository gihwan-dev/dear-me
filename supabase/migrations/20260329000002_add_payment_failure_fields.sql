ALTER TABLE letters
ADD COLUMN IF NOT EXISTS payment_error_code TEXT,
ADD COLUMN IF NOT EXISTS payment_error_message TEXT;
