-- Branding settings table for Agency tier custom PDF branding
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#7c3aed',
  secondary_color TEXT DEFAULT '#6d28d9',
  footer_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (our API uses service role key)
CREATE POLICY "Service role full access" ON branding_settings
  FOR ALL USING (true) WITH CHECK (true);
