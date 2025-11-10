// client/src/components/PostComposer.tsx
import { useState } from "react";
import { useSession } from "../hooks/useSession";
import { savePost } from "../lib/posts"; // o tu función actual de guardado

export default function PostComposer({ onCreated }: { onCreated: () => void }) {
  const { user } = useSession();
  const [text, setText] = useState("");
  const [category, setCategory] = useState<
    "deporte" | "nutricion" | "recuperacion" | "terapia" | "otro"
  >("deporte");
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <div className="card" style={{ marginTop: 12 }}>
        <div className="h3">Comparte tu progreso</div>
        <p style={{ color: "#6b7280" }}>
          Inicia sesión para publicar en tu feed y recibir interacciones.
        </p>
        <button
          className="btn primary"
          onClick={() => (window.location.href = "/login?from=/")}
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  async function submit() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await savePost({
        authorId: user.id,
        authorHandle: user.email?.split("@")[0] ?? "usuario",
        text,
        category,
        createdAt: Date.now(),
      });
      setText("");
      onCreated();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="h3">Comparte tu progreso</div>
      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <select
          className="btn"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
        >
          <option value="deporte">Deporte</option>
          <option value="nutricion">Nutrición</option>
          <option value="recuperacion">Recuperación</option>
          <option value="terapia">Terapia</option>
          <option value="otro">Otro</option>
        </select>
        <textarea
          className="btn"
          placeholder="¿Qué hiciste hoy?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <button
          className="btn primary"
          onClick={submit}
          disabled={busy || !text.trim()}
        >
          {busy ? "Publicando…" : "Publicar"}
        </button>
      </div>
    </div>
  );
}
