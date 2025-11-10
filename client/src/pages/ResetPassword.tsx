// client/src/pages/ResetPassword.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // Supabase ya trae una sesión temporal si vienes de "recovery"
  }, []);

  async function setNewPassword() {
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setMsg(error.message);
    setMsg("Contraseña actualizada. Redirigiendo…");
    setTimeout(() => navigate("/", { replace: true }), 1000);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#000",
        color: "#fff",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h2>Define tu nueva contraseña</h2>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
          }}
        />
        <button
          onClick={setNewPassword}
          disabled={busy}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #00B3A6",
            background: "#00B3A6",
            color: "#00110F",
            fontWeight: 700,
          }}
        >
          {busy ? "Guardando…" : "Guardar contraseña"}
        </button>
        {msg && <div style={{ marginTop: 10, color: "#9ae6b4" }}>{msg}</div>}
      </div>
    </div>
  );
}
