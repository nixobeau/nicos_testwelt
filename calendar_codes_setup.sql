-- Tabelle für Calendar Codes
CREATE TABLE calendar_codes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  code VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index auf code für schnelle Suche
CREATE INDEX idx_calendar_codes_code ON calendar_codes(code);

-- Index auf ip_address für IP-Tracking
CREATE INDEX idx_calendar_codes_ip ON calendar_codes(ip_address);

-- Index auf used für verfügbare Codes
CREATE INDEX idx_calendar_codes_used ON calendar_codes(used);

-- Enable Row Level Security
ALTER TABLE calendar_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can select calendar codes" ON calendar_codes FOR SELECT USING (true);
CREATE POLICY "Anyone can update calendar codes" ON calendar_codes FOR UPDATE USING (true);

-- Insert 1000 codes (Code001 to Code1000)
INSERT INTO calendar_codes (code) 
SELECT 'Code' || LPAD(i::text, 3, '0') 
FROM generate_series(1, 1000) AS t(i)
ON CONFLICT (code) DO NOTHING;
