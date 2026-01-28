-- Create golf_codes table for Golf Post 1000 codes
CREATE TABLE IF NOT EXISTS golf_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 1000 codes using generate_series (Code001 to Code1000)
INSERT INTO golf_codes (code) 
SELECT 'Code' || LPAD(i::text, 3, '0') 
FROM generate_series(1, 1000) AS t(i)
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE golf_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can select golf codes" ON golf_codes FOR SELECT USING (true);
CREATE POLICY "Anyone can update golf codes" ON golf_codes FOR UPDATE USING (true);
