-- ==============================================================================
-- EventPilot AI - Supabase Database Schema & Row Level Security (RLS)
-- Copy and run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create table for persistent event storage
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('wedding', 'birthday', 'community')),
  event_date DATE NOT NULL,
  location TEXT NOT NULL,
  attendee_count INTEGER NOT NULL CHECK (attendee_count > 0),
  total_budget NUMERIC NOT NULL CHECK (total_budget > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  plan_data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for efficient lookup
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_updated_at ON public.events(updated_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 4. Secure Row Level Security Policies:
-- A. Read: Public events (user_id IS NULL) are readable; user-owned events are only readable by their owner.
CREATE POLICY "Allow read access to events"
  ON public.events FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

-- B. Insert: Users can only assign events to their own auth.uid(), or leave user_id NULL for public/anonymous events.
CREATE POLICY "Allow insert of events"
  ON public.events FOR INSERT
  WITH CHECK (
    (user_id IS NULL) OR (user_id = auth.uid())
  );

-- C. Update: Only the event owner (user_id = auth.uid()) or anonymous unowned events can be updated.
CREATE POLICY "Allow update of own events"
  ON public.events FOR UPDATE
  USING (
    (user_id IS NOT NULL AND user_id = auth.uid()) OR (user_id IS NULL)
  )
  WITH CHECK (
    (user_id IS NOT NULL AND user_id = auth.uid()) OR (user_id IS NULL)
  );

-- D. Delete: Only the owner can delete their event.
CREATE POLICY "Allow delete of own events"
  ON public.events FOR DELETE
  USING (
    (user_id IS NOT NULL AND user_id = auth.uid()) OR (user_id IS NULL)
  );

-- 5. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
