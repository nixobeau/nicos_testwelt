-- Create golf_codes table for 1000 codes
CREATE TABLE IF NOT EXISTS golf_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 1000 golf codes (GOLF0001 through GOLF1000) using dynamic generation
INSERT INTO golf_codes (code, ip_address, assigned_at) 
SELECT 'GOLF' || LPAD(i::text, 4, '0'), NULL, NULL 
FROM generate_series(1, 1000) AS i;

-- Enable Row Level Security
ALTER TABLE golf_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for public SELECT
CREATE POLICY "Allow public select golf_codes" ON golf_codes
  FOR SELECT USING (true);

-- Create policy for public UPDATE
CREATE POLICY "Allow public update golf_codes" ON golf_codes
  FOR UPDATE USING (true) WITH CHECK (true);
