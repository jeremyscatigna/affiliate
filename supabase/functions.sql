-- Function to increment clicks on referral link
CREATE OR REPLACE FUNCTION increment_clicks(referral_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE referral_links 
  SET clicks = clicks + 1 
  WHERE code = referral_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;