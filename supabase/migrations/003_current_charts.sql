-- Lá số hiện tại của mỗi người dùng, tách biệt hoàn toàn với Quẻ đã lưu (public.charts).
-- Idempotent so it can be re-run on an existing database.

CREATE TABLE IF NOT EXISTS public.current_charts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_info JSONB NOT NULL,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.current_charts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own current chart" ON public.current_charts;
DROP POLICY IF EXISTS "Users can create own current chart" ON public.current_charts;
DROP POLICY IF EXISTS "Users can update own current chart" ON public.current_charts;
DROP POLICY IF EXISTS "Users can delete own current chart" ON public.current_charts;

CREATE POLICY "Users can view own current chart"
  ON public.current_charts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own current chart"
  ON public.current_charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own current chart"
  ON public.current_charts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own current chart"
  ON public.current_charts FOR DELETE
  USING (auth.uid() = user_id);
