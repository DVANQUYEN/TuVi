-- Yêu cầu luận giải tình duyên do khách gửi. Chỉ cho phép ghi, không cho phép
-- đọc/sửa/xoá từ client; dữ liệu chỉ đọc qua service role hoặc dashboard.
-- Idempotent so it can be re-run on an existing database.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.love_compatibility_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  person1_name TEXT NOT NULL,
  person2_name TEXT NOT NULL,
  person1_gender TEXT NOT NULL,
  person2_gender TEXT NOT NULL,
  person1_birth_info JSONB NOT NULL,
  person2_birth_info JSONB NOT NULL,
  compatibility_score INTEGER,
  compatibility_level TEXT,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT love_compatibility_requests_person1_gender_check
    CHECK (person1_gender IN ('nam', 'nu')),
  CONSTRAINT love_compatibility_requests_person2_gender_check
    CHECK (person2_gender IN ('nam', 'nu')),
  CONSTRAINT love_compatibility_requests_opposite_genders_check
    CHECK (person1_gender <> person2_gender),
  CONSTRAINT love_compatibility_requests_person1_name_check
    CHECK (char_length(btrim(person1_name)) BETWEEN 1 AND 120),
  CONSTRAINT love_compatibility_requests_person2_name_check
    CHECK (char_length(btrim(person2_name)) BETWEEN 1 AND 120),
  CONSTRAINT love_compatibility_requests_score_check
    CHECK (compatibility_score IS NULL OR compatibility_score BETWEEN 0 AND 100)
);

ALTER TABLE public.love_compatibility_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert love compatibility requests"
  ON public.love_compatibility_requests;

CREATE POLICY "Anyone can insert love compatibility requests"
  ON public.love_compatibility_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND person1_gender <> person2_gender
    AND char_length(btrim(person1_name)) BETWEEN 1 AND 120
    AND char_length(btrim(person2_name)) BETWEEN 1 AND 120
  );

CREATE INDEX IF NOT EXISTS idx_love_compatibility_requests_created_at
  ON public.love_compatibility_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_love_compatibility_requests_user_id
  ON public.love_compatibility_requests(user_id);
