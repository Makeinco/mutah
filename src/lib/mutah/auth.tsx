import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";

export type MutahRole = "contributor" | "reviewer" | "admin";

export type MutahProfile = {
  id: string;
  display_name: string | null;
  role: MutahRole;
  language: "ar" | "en";
};

type AuthState = {
  ready: boolean;
  session: Session | null;
  user: User | null;
  profile: MutahProfile | null;
  signInWithEmail: (email: string, language?: "ar" | "en") => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  canReview: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

async function loadProfile(userId: string): Promise<MutahProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,display_name,role,language")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as MutahProfile | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<MutahProfile | null>(null);

  const hydrate = useCallback(async (next: Session | null) => {
    setSession(next);
    if (!next?.user) {
      setProfile(null);
      setReady(true);
      return;
    }
    try {
      setProfile(await loadProfile(next.user.id));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      void hydrate(next);
    });
    return () => data.subscription.unsubscribe();
  }, [hydrate]);

  const signInWithEmail = useCallback(async (email: string, language: "ar" | "en" = "ar") => {
    const redirectTo = typeof window === "undefined" ? undefined : `${window.location.origin}/account`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
        data: { language },
      },
    });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    setProfile(await loadProfile(session.user.id));
  }, [session]);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      session,
      user: session?.user ?? null,
      profile,
      signInWithEmail,
      signOut,
      refreshProfile,
      canReview: profile?.role === "reviewer" || profile?.role === "admin",
      isAdmin: profile?.role === "admin",
    }),
    [ready, session, profile, signInWithEmail, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
