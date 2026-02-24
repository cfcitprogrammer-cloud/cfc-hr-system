import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // your Supabase client
import { Session, User } from "@supabase/supabase-js";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

type AppUser = {
  id: string;
  email?: string | null;
  role?: string; // from raw_app_meta_data
  rawUserMeta?: Record<string, any>;
  rawAppMeta?: Record<string, any>;
};

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let mounted = true;

    async function fetchSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      const session = data.session;
      const u = session?.user;

      if (u) {
        setUser({
          id: u.id,
          email: u.email,
          rawUserMeta: u.user_metadata,
          rawAppMeta: u.app_metadata,
          role: u.app_metadata?.role,
        });
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    }

    fetchSession();

    // Listen for changes in auth state
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user;
        if (u) {
          setUser({
            id: u.id,
            email: u.email,
            rawUserMeta: u.user_metadata,
            rawAppMeta: u.app_metadata,
            role: u.app_metadata?.role,
          });
          setStatus("authenticated");
        } else {
          setUser(null);
          setStatus("unauthenticated");
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, status };
}
