ALTER TABLE letters
ADD COLUMN IF NOT EXISTS payment_amount INTEGER;

UPDATE letters
SET payment_amount = 490
WHERE payment_amount IS NULL;

ALTER TABLE letters
ALTER COLUMN payment_amount SET NOT NULL;
