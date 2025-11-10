// client/src/hooks/useSession.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<
    import("@supabase/supabase-js").Session | null
  >(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  return { loading, session, user };
}
