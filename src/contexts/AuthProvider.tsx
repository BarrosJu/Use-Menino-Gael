import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext, type AuthContextValue } from '@/contexts/authContext';
import { supabase } from '@/lib/supabase';

async function fetchIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }
  return data !== null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const applySession = (nextSession: Session | null) => {
      (async () => {
        const admin = nextSession ? await fetchIsAdmin(nextSession.user.id) : false;
        if (!active) return;
        setSession(nextSession);
        setIsAdmin(admin);
        setLoading(false);
      })();
    };

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAdmin,
      loading,
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return error.message.toLowerCase().includes('invalid')
            ? 'E-mail ou senha incorretos.'
            : 'Não foi possível entrar agora. Tente novamente.';
        }
        if (!data.session) return 'Não foi possível iniciar a sessão.';

        const admin = await fetchIsAdmin(data.session.user.id);
        if (!admin) {
          await supabase.auth.signOut();
          return 'Esta conta não tem permissão para acessar o painel.';
        }
        return null;
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, isAdmin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
