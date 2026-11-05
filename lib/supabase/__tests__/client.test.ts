import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(() => ({ auth: {} })),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

describe('supabase client configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('creates the browser client from the public environment variables', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const { isSupabaseConfigured, supabase } = await import('@/lib/supabase/client');

    expect(createClientMock).toHaveBeenCalledWith('https://project.supabase.co', 'anon-key');
    expect(isSupabaseConfigured).toBe(true);
    expect(supabase).toEqual({ auth: {} });
  });

  it('falls back to placeholder credentials when the environment is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', undefined);
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', undefined);

    const { isSupabaseConfigured } = await import('@/lib/supabase/client');

    expect(createClientMock).toHaveBeenCalledWith(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    );
    expect(isSupabaseConfigured).toBe(false);
  });

  it('creates the admin client with the service role key and without session persistence', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key');

    const { supabaseAdmin } = await import('@/lib/supabase/server');

    expect(createClientMock).toHaveBeenCalledWith(
      'https://project.supabase.co',
      'service-role-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    expect(supabaseAdmin).toEqual({ auth: {} });
  });
});
