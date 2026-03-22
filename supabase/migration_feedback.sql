-- Feedback / Testimonial Collection
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_testimonial BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_audit_id ON public.feedback(audit_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service can manage feedback" ON public.feedback
  FOR ALL USING (true) WITH CHECK (true);

-- Users can see their own feedback
CREATE POLICY "Users see own feedback" ON public.feedback
  FOR SELECT USING (user_id = auth.uid());
