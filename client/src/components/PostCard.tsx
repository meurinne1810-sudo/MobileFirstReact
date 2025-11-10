// client/src/components/PostCard.tsx
export default function PostCard({ user, type, text }:{
  user:string; type:string; text:string;
}){
  return (
    <div className="card" style={{ marginTop:12 }}>
      <div className="accent" style={{ background:"var(--blue, #3B82F6)" }} />
      <div style={{ fontWeight:800 }}>{user} • {label(type)}</div>
      <div style={{ marginTop:6 }}>{text}</div>
    </div>
  );
}

function label(t:string){
  return ({
    ejercicio:"Ejercicio",
    alimentacion:"Alimentación",
    recuperacion:"Recuperación",
    salud_mental:"Salud mental",
    habito:"Hábito",
  } as Record<string,string>)[t] || t;
}