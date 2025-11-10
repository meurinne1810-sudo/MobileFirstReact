// client/src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    (async () => {
      // Intercambia el "code" por sesión (OAuth / magic link / confirmación)
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href,
      );
      if (error) {
        console.error(error);
        alert(error.message);
        navigate("/login", { replace: true });
        return;
      }

      // Si viene de “recovery”, mejor redirige a setear nueva contraseña
      const isRecovery = new URLSearchParams(search).get("type") === "recovery";
      navigate(isRecovery ? "/reset-password" : "/", { replace: true });
    })();
  }, [navigate, search]);

  return (
    <p style={{ textAlign: "center", marginTop: "50%" }}>
      Completando autenticación…
    </p>
  );
}
