-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create affiliates table
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bank_info JSONB,
  status TEXT CHECK (status IN ('pending', 'approved', 'suspended')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referral_links table
CREATE TABLE referral_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prospects table
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'client', 'lost')) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create commissions table
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_prospects_affiliate_id ON prospects(affiliate_id);
CREATE INDEX idx_invoices_prospect_id ON invoices(prospect_id);
CREATE INDEX idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX idx_referral_links_code ON referral_links(code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Policies for affiliates
CREATE POLICY "Affiliates can view their own data" ON affiliates
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create an affiliate account" ON affiliates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Affiliates can update their own data" ON affiliates
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies for referral_links
CREATE POLICY "Affiliates can view their own links" ON referral_links
  FOR SELECT USING (auth.uid()::text = affiliate_id::text);

-- Policies for prospects
CREATE POLICY "Affiliates can view their referred prospects" ON prospects
  FOR SELECT USING (auth.uid()::text = affiliate_id::text);

-- Policies for commissions
CREATE POLICY "Affiliates can view their own commissions" ON commissions
  FOR SELECT USING (auth.uid()::text = affiliate_id::text);

-- Admin policies (you'll need to create an admin role)
-- CREATE POLICY "Admins can do everything" ON affiliates
--   FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
-- Repeat for other tables...