-- Ensure charts rows are only visible to their owner.
-- Idempotent so it can be re-run on an existing database.

ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can create own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can update own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can delete own charts" ON public.charts;

CREATE POLICY "Users can view own charts"
  ON public.charts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own charts"
  ON public.charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts"
  ON public.charts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts"
  ON public.charts FOR DELETE
  USING (auth.uid() = user_id);
