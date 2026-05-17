-- User scores table for the global leaderboard
-- Each user has one row; updated via upsert whenever they complete amls

CREATE TABLE IF NOT EXISTS public.user_scores (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID         NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT         NOT NULL DEFAULT '',
  avatar_initial TEXT       NOT NULL DEFAULT '',
  total_points INTEGER      NOT NULL DEFAULT 0,
  today_points INTEGER      NOT NULL DEFAULT 0,
  streak_days  INTEGER      NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

-- Anyone can read the leaderboard
CREATE POLICY "leaderboard_public_read"
  ON public.user_scores
  FOR SELECT
  USING (true);

-- Users can only insert/update their own row
CREATE POLICY "leaderboard_own_upsert"
  ON public.user_scores
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "leaderboard_own_update"
  ON public.user_scores
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Index for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_user_scores_total ON public.user_scores (total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_scores_today ON public.user_scores (today_points DESC);
