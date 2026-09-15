import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export interface OwnerProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  role_title: string | null;
  responsible_name: string | null;
  responsible_email: string | null;
  is_self_responsible: boolean;
  avatar_url: string | null;
}

export interface MfaFactorState {
  id: string;
  status: string;
  friendlyName: string | null;
}

/**
 * Auth real do proprietário: cadastro, login, recuperação, MFA (TOTP) e
 * persistência de perfil na tabela profiles (RLS por auth.uid()).
 */
export function useOwnerAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<MfaFactorState[]>([]);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    setProfile((data as OwnerProfile | null) ?? null);
  }, []);

  const refreshFactors = useCallback(async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.totp ?? [];
    setFactors(
      totp.map((f) => ({
        id: f.id,
        status: f.status,
        friendlyName: f.friendly_name ?? null,
      })),
    );
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (
        event !== "SIGNED_IN" &&
        event !== "SIGNED_OUT" &&
        event !== "USER_UPDATED" &&
        event !== "INITIAL_SESSION"
      ) {
        return;
      }
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user) {
        void loadProfile(next.user.id);
        void refreshFactors();
      } else {
        setProfile(null);
        setFactors([]);
      }
      setLoading(false);
    });

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        void loadProfile(data.session.user.id);
        void refreshFactors();
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfile, refreshFactors]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    return { error, needsConfirmation: !error && !data.session };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const requestRecovery = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  }, []);

  const saveProfile = useCallback(
    async (values: Partial<OwnerProfile>) => {
      if (!user) return { error: new Error("Sem sessão autenticada.") };
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, email: user.email ?? null, ...values });
      if (!error) await loadProfile(user.id);
      return { error };
    },
    [user, loadProfile],
  );

  const enrollMfa = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `owner-${Date.now()}`,
    });
    if (error) return { error, factorId: null, qr: null, secret: null };
    return {
      error: null,
      factorId: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    };
  }, []);

  const verifyMfa = useCallback(
    async (factorId: string, code: string) => {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) return { error: challenge.error };
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code,
      });
      if (!error) await refreshFactors();
      return { error };
    },
    [refreshFactors],
  );

  const unenrollMfa = useCallback(
    async (factorId: string) => {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (!error) await refreshFactors();
      return { error };
    },
    [refreshFactors],
  );

  return {
    session,
    user,
    profile,
    loading,
    factors,
    signUp,
    signIn,
    signOut,
    requestRecovery,
    saveProfile,
    enrollMfa,
    verifyMfa,
    unenrollMfa,
  };
}
