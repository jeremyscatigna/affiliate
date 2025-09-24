-- Function to increment clicks on referral link
CREATE OR REPLACE FUNCTION increment_clicks(referral_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE referral_links 
  SET clicks = clicks + 1 
  WHERE code = referral_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();