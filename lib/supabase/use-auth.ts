'use client';

import { useEffect, useState } from 'react';
import type { AuthResponse, User } from '@supabase/supabase-js';
import { supabase } from './client';
import { migrateFromLocalStorage } from '@/lib/utils/storage';

export function useAuth(): {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
} {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return (): void => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<AuthResponse> => {
    const trimmedName = fullName?.trim();

    const result = await supabase.auth.signUp({
      email,
      password,
      ...(trimmedName ? { options: { data: { full_name: trimmedName } } } : {}),
    });

    if (!result.error && result.data.session?.user) {
      try {
        await migrateFromLocalStorage(result.data.session.user.id);
      } catch (error) {
        console.error('Failed to migrate local charts:', error);
      }
    }

    return result;
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const result = await supabase.auth.signInWithPassword({ email, password });

    if (!result.error && result.data.session?.user) {
      try {
        await migrateFromLocalStorage(result.data.session.user.id);
      } catch (error) {
        console.error('Failed to migrate local charts:', error);
      }
    }

    return result;
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
}
