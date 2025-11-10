// client/src/pages/Join.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadChallenges, saveChallenges } from "../lib/challengesStore";
import type { Challenge } from "../lib/challenges";

export default function JoinInvite(){
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<string>("Procesando tu invitación…");

  useEffect(() => {
    const id   = params.get("c") || "";
    const code = params.get("code") || "";

    if (!id || !code) {
      setMsg("Link incompleto. Redirigiendo a Retos…");
      setTimeout(()=>navigate("/retos?tab=disponibles", { replace:true }), 1200);
      return;
    }

    const list = loadChallenges();
    const idx  = list.findIndex(c => c.id === id);
    if (idx < 0) {
      setMsg("Reto no encontrado. Redirigiendo a Retos…");
      setTimeout(()=>navigate("/retos?tab=disponibles", { replace:true }), 1200);
      return;
    }

    const ch = list[idx];

    const valid =
      ch.visibility === "privado" &&
      !!ch.inviteCode &&
      ch.inviteCode === code;

    if (!valid) {
      setMsg("Invitación inválida o expirada. Redirigiendo a Retos…");
      setTimeout(()=>navigate("/retos?tab=disponibles", { replace:true }), 1400);
      return;
    }

    if (ch.status === "activo") {
      setMsg("Ya estabas dentro de este reto. ¡Vamos a Retos!");
      setTimeout(()=>navigate("/retos?tab=activos", { replace:true }), 900);
      return;
    }

    const updated: Challenge = {
      ...ch,
      status: "activo",
      participants: (ch.participants || 0) + 1,
    };
    const next = [...list];
    next[idx] = updated;
    saveChallenges(next);

    setMsg("¡Listo! Te uniste al reto. Abriendo Retos → Activos…");
    setTimeout(()=>navigate("/retos?tab=activos", { replace:true }), 800);
  }, [params, navigate]);

  return (
    <div style={{ padding:16 }}>
      <div className="card" style={{ marginTop:12, textAlign:"center" }}>
        <div className="h3">Unirse por invitación</div>
        <p style={{ marginTop:8 }}>{msg}</p>
        <button className="btn" onClick={()=>navigate("/retos?tab=activos", { replace:true })} style={{ marginTop:8 }}>
          Ir a Retos
        </button>
      </div>
    </div>
  );
}