-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Charts table
CREATE TABLE public.charts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_info JSONB NOT NULL,
  preferences JSONB,
  chart_data JSONB, -- Lưu toàn bộ ZiweiChart
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Current chart (one per user, separate from saved charts)
CREATE TABLE public.current_charts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_info JSONB NOT NULL,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Love compatibility requests (write-only for clients)
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

-- Shares table
CREATE TABLE public.shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chart_id UUID REFERENCES public.charts(id) ON DELETE CASCADE NOT NULL,
  share_url TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_charts_user_id ON public.charts(user_id);
CREATE INDEX idx_charts_created_at ON public.charts(created_at DESC);
CREATE INDEX idx_shares_chart_id ON public.shares(chart_id);
CREATE INDEX idx_shares_share_url ON public.shares(share_url);
CREATE INDEX idx_love_compatibility_requests_created_at
  ON public.love_compatibility_requests(created_at DESC);
CREATE INDEX idx_love_compatibility_requests_user_id
  ON public.love_compatibility_requests(user_id);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_compatibility_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for charts
CREATE POLICY "Users can view own charts" ON public.charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own charts" ON public.charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts" ON public.charts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts" ON public.charts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for current chart
CREATE POLICY "Users can view own current chart" ON public.current_charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own current chart" ON public.current_charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own current chart" ON public.current_charts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own current chart" ON public.current_charts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for love compatibility requests: insert only, no client reads.
CREATE POLICY "Anyone can insert love compatibility requests"
  ON public.love_compatibility_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND person1_gender <> person2_gender
    AND char_length(btrim(person1_name)) BETWEEN 1 AND 120
    AND char_length(btrim(person2_name)) BETWEEN 1 AND 120
  );

-- Policies for shares (public read)
CREATE POLICY "Anyone can view shares" ON public.shares
  FOR SELECT USING (true);

CREATE POLICY "Users can create shares for own charts" ON public.shares
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.charts
      WHERE id = chart_id AND user_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
