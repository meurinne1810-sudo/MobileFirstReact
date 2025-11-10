// client/src/hooks/useSession.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type SessionState = {
  user: import("@supabase/supabase-js").User | null;
  loading: boolean;
};

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setState({ user: data.user ?? null, loading: false });
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState({ user: session?.user ?? null, loading: false });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state; // <- nunca null
}
