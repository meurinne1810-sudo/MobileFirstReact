// client/src/components/CreateChallengeForm.tsx
import { useState } from "react";
import type { Challenge, PrizeConfig } from "../lib/challenges";

export default function CreateChallengeForm({
  onCreate,
  onCancel,
}: {
  onCreate: (c: Challenge) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("Registra tu actividad diariamente.");
  const [visibility, setVisibility] = useState<"global" | "privado">("global");
  const [hasPrizes, setHasPrizes] = useState(false);
  const [entryFee, setEntryFee] = useState<number | "">("");
  const [distribution, setDistribution] = useState<
    "winner_takes_all" | "custom"
  >("winner_takes_all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [invited, setInvited] = useState<string>(""); // coma-separado

  function randomId() {
    return "c" + Math.random().toString(36).slice(2, 9);
  }
  function randomCode() {
    return Math.random().toString(36).slice(2, 8);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedRules = rules
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const invitedList =
      visibility === "privado"
        ? invited
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const entryFeeNum =
      typeof entryFee === "string" ? Number(entryFee || 0) : entryFee || 0;

    // prizeConfig solo para privados con fee > 0
    let prizeConfig: PrizeConfig | undefined = undefined;
    if (visibility === "privado" && hasPrizes && entryFeeNum > 0) {
      prizeConfig = {
        model: "entry_fee",
        entryFee: entryFeeNum,
        distribution:
          distribution === "winner_takes_all"
            ? { type: "winner_takes_all" }
            : { type: "custom", splits: [] },
      };
    }

    const nowISO = new Date().toISOString().slice(0, 10);

    const newChallenge: Challenge = {
      id: randomId(),
      title: title.trim() || "Nuevo reto",
      description: description.trim() || "Sumemos constancia con causa.",
      rules: cleanedRules.length ? cleanedRules : ["Registra tu actividad."],
      visibility,
      status: "disponible", // Retos.tsx lo moverá a ACTIVO si createdByMe=true
      participants: 0,
      members: [],
      startDate: startDate || nowISO,
      endDate: endDate || "",
      hasPrizes: !!(hasPrizes && (prizeConfig || invitedList.length > 0)),
      prizes: undefined,
      prizeConfig,
      invited: invitedList,
      inviteCode: invitedList.length ? randomCode() : undefined,
      leaderboard: [],
      createdByMe: true, // ← importante para que Retos.tsx lo active directo para ti
    };

    onCreate(newChallenge);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginTop: 8 }}>
      <div
        className="accent"
        style={{ background: "var(--primary,#00B3A6)" }}
      />
      <div className="h3">Crear reto</div>

      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <label className="btn" style={{ display: "grid", gap: 6 }}>
          <span>Título</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. 10,000 pasos diarios"
          />
        </label>

        <label className="btn" style={{ display: "grid", gap: 6 }}>
          <span>Descripción</span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el reto brevemente…"
          />
        </label>

        <label className="btn" style={{ display: "grid", gap: 6 }}>
          <span>Reglas (una por línea)</span>
          <textarea
            rows={3}
            value={rules}
            onChange={(e) => setRules(e.target.value)}
          />
        </label>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <label className="btn" style={{ display: "grid", gap: 6 }}>
            <span>Inicio</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="btn" style={{ display: "grid", gap: 6 }}>
            <span>Fin (opcional)</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <label className="btn" style={{ display: "grid", gap: 6 }}>
            <span>Visibilidad</span>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
            >
              <option value="global">Público</option>
              <option value="privado">Privado</option>
            </select>
          </label>

          <label
            className="btn"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <input
              type="checkbox"
              checked={hasPrizes}
              onChange={(e) => setHasPrizes(e.target.checked)}
            />
            ¿Con premio?
          </label>
        </div>

        {/* Config de premios: solo tiene sentido en privados */}
        {visibility === "privado" && hasPrizes && (
          <div className="card" style={{ display: "grid", gap: 8 }}>
            <div className="h4">Premio (privado)</div>
            <label className="btn" style={{ display: "grid", gap: 6 }}>
              <span>Fee de entrada (MXN)</span>
              <input
                type="number"
                min={0}
                step="1"
                value={entryFee}
                onChange={(e) =>
                  setEntryFee(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="Ej. 200"
              />
            </label>

            <label className="btn" style={{ display: "grid", gap: 6 }}>
              <span>Distribución</span>
              <select
                value={distribution}
                onChange={(e) => setDistribution(e.target.value as any)}
              >
                <option value="winner_takes_all">Ganador se lleva todo</option>
                <option value="custom">Personalizada (próximamente)</option>
              </select>
            </label>

            <div className="caption-muted">
              🔒 Los pagos dentro de la app están bloqueados por ahora. Verás el
              botón
              <b> “Pagar entrada (próximamente)”</b> en el detalle del reto.
            </div>

            <label className="btn" style={{ display: "grid", gap: 6 }}>
              <span>Invitados (separados con comas)</span>
              <input
                value={invited}
                onChange={(e) => setInvited(e.target.value)}
                placeholder="@amigo1, @amigo2"
              />
            </label>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {onCancel && (
            <button type="button" className="btn" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn primary">
            Crear
          </button>
        </div>
      </div>
    </form>
  );
}
