'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabase } from '../../lib/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: 'Not initialized' }),
  signUp: async () => ({ error: 'Not initialized' }),
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Auth not configured' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await getSupabase().auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      return { error: error?.message ?? null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Auth not configured' };
    }
  };

  const signOut = async () => {
    try {
      await getSupabase().auth.signOut();
    } catch {
      // Auth not configured — silently ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
