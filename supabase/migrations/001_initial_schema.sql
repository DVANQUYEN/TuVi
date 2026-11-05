-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
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
