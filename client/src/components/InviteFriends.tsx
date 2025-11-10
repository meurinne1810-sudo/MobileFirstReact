// client/src/components/InviteFriends.tsx
import { useMemo, useState } from "react";
import type { Challenge } from "../lib/challenges";

type Props = {
  challenge: Challenge;
  onCancel: () => void;
  onSave: (next: { invited: string[]; inviteCode: string }) => void;
};

function makeCode() {
  return Math.random().toString(36).slice(2, 10);
}

export default function InviteFriends({ challenge, onCancel, onSave }: Props){
  const [entries, setEntries] = useState<string[]>(
    challenge.invited?.length ? challenge.invited : []
  );
  const [input, setInput] = useState("");
  const code = challenge.inviteCode ?? makeCode();

  const inviteUrl = useMemo(()=>{
    const origin = window?.location?.origin ?? "";
    return `${origin}/join?c=${challenge.id}&code=${code}`;
  }, [challenge.id, code]);

  const add = () => {
    const v = input.trim();
    if (!v) return;
    setEntries(prev => Array.from(new Set([...prev, v])));
    setInput("");
  };
  const remove = (idx:number) => {
    setEntries(prev => prev.filter((_,i)=>i!==idx));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      alert("Link copiado al portapapeles");
    } catch {
      // fallback silencioso
    }
  };

  return (
    <div className="card" style={{ marginTop:12 }}>
      <div className="accent" style={{ background:"var(--blue,#3B82F6)" }} />
      <div className="h3">Invitar amigos</div>

      <div style={{ display:"grid", gap:8, marginTop:8 }}>
        <div className="btn" style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input
            placeholder="@usuario, email o teléfono"
            value={input}
            onChange={e=>setInput(e.target.value)}
            style={{ flex:1, border:"none", background:"transparent" }}
          />
          <button type="button" className="btn" onClick={add}>Agregar</button>
        </div>

        {entries.length>0 && (
          <div className="card" style={{ display:"grid", gap:6 }}>
            <div style={{ fontWeight:700 }}>Invitados</div>
            {entries.map((v,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span>{v}</span>
                <button className="btn" onClick={()=>remove(i)}>Quitar</button>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ display:"grid", gap:6 }}>
          <div style={{ fontWeight:700 }}>Link de invitación</div>
          <div className="btn" style={{ wordBreak:"break-all" }}>{inviteUrl}</div>
          <button type="button" className="btn" onClick={copy}>Copiar link</button>
          <small style={{ color:"#6b7280" }}>
            Más adelante este link permitirá aceptar la invitación automáticamente.
          </small>
        </div>

        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
          <button
            className="btn primary"
            onClick={()=>onSave({ invited: entries, inviteCode: code })}
          >
            Guardar invitaciones
          </button>
        </div>
      </div>
    </div>
  );
}