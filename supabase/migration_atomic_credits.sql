-- Atomic credit deduction function
-- Prevents race conditions by doing read+check+update in a single transaction
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INT DEFAULT 1)
RETURNS INT AS $$
DECLARE
  current_bal INT;
BEGIN
  -- Lock the row for update to prevent concurrent modifications
  SELECT balance INTO current_bal
  FROM credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- If no row found, return -1 (no credits row)
  IF NOT FOUND THEN
    RETURN -1;
  END IF;

  -- If insufficient balance, return -1
  IF current_bal < p_amount THEN
    RETURN -1;
  END IF;

  -- Deduct and return new balance
  UPDATE credits
  SET balance = balance - p_amount
  WHERE user_id = p_user_id;

  RETURN current_bal - p_amount;
END;
$$ LANGUAGE plpgsql;

-- Atomic credit addition function
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_amount INT)
RETURNS INT AS $$
DECLARE
  new_bal INT;
BEGIN
  -- Upsert: create row if it doesn't exist, add credits atomically
  INSERT INTO credits (user_id, balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = credits.balance + p_amount
  RETURNING balance INTO new_bal;

  RETURN new_bal;
END;
$$ LANGUAGE plpgsql;
