// client/src/pages/Retos.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Challenge } from "../lib/challenges";
import { loadChallenges, saveChallenges } from "../lib/challengesStore";
import CreateChallengeForm from "../components/CreateChallengeForm";
import InviteFriends from "../components/InviteFriends";

type Mode = "activos" | "disponibles" | "vencidos";

// Usuario “demo” por si aún no conectas sesión real.
// Si ya tienes currentUserId() en ../lib/user puedes reemplazar.
const CURRENT_USER = "@demo-user";

/* ========================= Helpers puros ========================= */
function invitedMeFor(c: Challenge, who: string = CURRENT_USER) {
  return (c?.invited || [])
    .map((s) =>
      String(s || "")
        .toLowerCase()
        .trim(),
    )
    .includes(String(who).toLowerCase());
}
function formatVigencia(start?: string, end?: string) {
  if (!start && !end) return "—";
  if (start && end) return `${start} → ${end}`;
  return start ? `Desde ${start}` : `Hasta ${end}`;
}
function daysLeft(end?: string) {
  if (!end) return undefined;
  const endD = new Date(end + "T23:59:59");
  const diff = Math.ceil((endD.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}
function hydrateStatuses(list: Challenge[]): Challenge[] {
  const today = new Date().toISOString().slice(0, 10);
  return list.map((c) => {
    const end = c?.endDate;
    if (end && end < today) {
      if (c.status !== "vencido") return { ...c, status: "vencido" };
    }
    return c;
  });
}

/* ========================= Página ========================= */
export default function Retos() {
  // Hidrata retos y corrige vencidos por fecha:
  const [list, setList] = useState<Challenge[]>(
    hydrateStatuses(loadChallenges()),
  );

  // UI state
  const [search, setSearch] = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    (search.get("tab") as Mode) || "activos",
  );
  const [showCreate, setShowCreate] = useState(false);
  const [inviteFor, setInviteFor] = useState<string | undefined>(undefined);

  // Búsqueda
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  const [includeBoth, setIncludeBoth] = useState(false); // buscar en Activos+Disponibles

  // Tarjeta expandida
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined);

  // Persistencia
  useEffect(() => {
    saveChallenges(list);
  }, [list]);

  // Sincroniza ?tab=
  useEffect(() => {
    const next = (search.get("tab") as Mode) || "activos";
    setMode(next);
    setIncludeBoth(false);
  }, [search]);

  /* ---------- LISTAS BASE (sin duplicados y ocultando privados sin invitación) ---------- */
  const activos = useMemo(
    () => list.filter((c) => c?.status === "activo"),
    [list],
  );
  const activosIds = useMemo(
    () => new Set(activos.map((c) => c.id)),
    [activos],
  );

  const disponibles = useMemo(
    () =>
      list.filter((c) => {
        if (!c || c.status !== "disponible") return false;
        if (activosIds.has(c.id)) return false;

        const visibility = c.visibility ?? "global";
        if (visibility === "global") return true;

        // privado → solo si estoy invitado
        return invitedMeFor(c);
      }),
    [list, activosIds],
  );

  const vencidos = useMemo(
    () => list.filter((c) => c?.status === "vencido"),
    [list],
  );

  /* ------------------- ORDEN UX ------------------- */
  const sortByEndAsc = (a?: string, b?: string) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return a.localeCompare(b);
  };
  const activosSorted = useMemo(
    () => [...activos].sort((a, b) => sortByEndAsc(a?.endDate, b?.endDate)),
    [activos],
  );
  const disponiblesSorted = useMemo(
    () =>
      [...disponibles].sort(
        (a, b) => (b?.participants || 0) - (a?.participants || 0),
      ),
    [disponibles],
  );
  const vencidosSorted = useMemo(
    () =>
      [...vencidos].sort((a, b) =>
        (b?.endDate || "").localeCompare(a?.endDate || ""),
      ),
    [vencidos],
  );

  /* ------------------- ACCIONES ------------------- */
  const join = (id: string) =>
    setList((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "activo", participants: (c.participants ?? 0) + 1 }
          : c,
      ),
    );

  const leave = (id: string) =>
    setList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "disponible",
              participants: Math.max(0, (c.participants ?? 0) - 1),
            }
          : c,
      ),
    );

  const remove = (id: string) =>
    setList((prev) => prev.filter((c) => c.id !== id));

  const accept = (id: string) => {
    const c = list.find((x) => x.id === id);
    if (!c) return;
    const visibility = c.visibility ?? "global";
    if (visibility === "privado" && !invitedMeFor(c)) {
      alert(
        "Este reto es privado. Pide invitación al creador o usa tu link personal.",
      );
      return;
    }
    join(id);
  };

  const onCreate = (c: Challenge) => {
    // Creador lo ve enseguida entre Disponibles (o Activos si tu lógica ya lo crea así):
    const normalized: Challenge = {
      ...c,
      visibility: c.visibility ?? "global",
      participants: c.participants ?? 0,
      rules: c.rules ?? [],
      prizeConfig:
        c.prizeConfig?.model === "entry_fee"
          ? {
              model: "entry_fee",
              entryFee: Number(c.prizeConfig.entryFee ?? 0),
            }
          : undefined,
    };
    setList((prev) => hydrateStatuses([normalized, ...prev]));
    setShowCreate(false);
    setMode("disponibles");
    setSearch({ tab: "disponibles" });
  };

  const saveInvites = (
    id: string,
    payload: { invited: string[]; inviteCode: string },
  ) => {
    setList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              invited: payload.invited ?? [],
              inviteCode: payload.inviteCode,
            }
          : c,
      ),
    );
    setInviteFor(undefined);
  };

  /* ------------------- BÚSQUEDA ------------------- */
  function matchesQuery(c: Challenge, query: string) {
    if (!query.trim()) return true;
    const t = query.trim().toLowerCase();
    const haystack = [c?.title, c?.description, ...(c?.rules || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(t);
  }

  const baseByMode =
    mode === "activos"
      ? activosSorted
      : mode === "disponibles"
        ? disponiblesSorted
        : vencidosSorted;

  const listForUI = useMemo(() => {
    let base: Challenge[] = [];
    if (mode === "vencidos") {
      base = vencidosSorted;
    } else if (includeBoth) {
      base = [...activosSorted, ...disponiblesSorted];
    } else {
      base = baseByMode;
    }
    return base.filter(Boolean).filter((c) => matchesQuery(c, q));
  }, [
    mode,
    includeBoth,
    q,
    activosSorted,
    disponiblesSorted,
    vencidosSorted,
    baseByMode,
  ]);

  const challengeToInvite = inviteFor
    ? list.find((c) => c.id === inviteFor)
    : undefined;

  /* ------------------- RETURN (UI) ------------------- */
  return (
    <div style={{ padding: 16, paddingBottom: 72 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <h2 className="h2" style={{ marginTop: 0 }}>
          Retos
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn"
            onClick={() => setShowSearch((v) => !v)}
            title="Buscar retos"
          >
            🔍
          </button>
          <button className="btn" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Cerrar" : "+ Crear reto"}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="card" style={{ marginTop: 8 }}>
          <div
            className="accent"
            style={{ background: "var(--blue,#3B82F6)" }}
          />
          <div className="h3">Buscar retos</div>
          <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <div
              className="btn"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ opacity: 0.7 }}>🔎</span>
              <input
                placeholder="Palabra clave (título, descripción o reglas)…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ flex: 1, border: "none", background: "transparent" }}
              />
              {q && (
                <button className="btn" type="button" onClick={() => setQ("")}>
                  Limpiar
                </button>
              )}
            </div>
            {mode !== "vencidos" && (
              <label
                className="btn"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <input
                  type="checkbox"
                  checked={includeBoth}
                  onChange={(e) => setIncludeBoth(e.target.checked)}
                />
                Buscar en <b>Activos + Disponibles</b>
              </label>
            )}
          </div>
        </div>
      )}

      {showCreate && (
        <CreateChallengeForm
          onCancel={() => setShowCreate(false)}
          onCreate={onCreate}
        />
      )}

      {/* Tabs */}
      <div className="seg" style={{ marginTop: 8 }}>
        <button
          className={mode === "activos" ? "on" : ""}
          onClick={() => {
            setMode("activos");
            setSearch({ tab: "activos" });
            setIncludeBoth(false);
          }}
        >
          Activos
        </button>
        <button
          className={mode === "disponibles" ? "on" : ""}
          onClick={() => {
            setMode("disponibles");
            setSearch({ tab: "disponibles" });
            setIncludeBoth(false);
          }}
        >
          Disponibles
        </button>
        <button
          className={mode === "vencidos" ? "on" : ""}
          onClick={() => {
            setMode("vencidos");
            setSearch({ tab: "vencidos" });
            setIncludeBoth(false);
          }}
        >
          Vencidos
        </button>
      </div>

      {/* Lista */}
      <section style={{ marginTop: 8 }}>
        {listForUI.length === 0 && (
          <Empty
            title={q ? "Sin resultados para tu búsqueda" : emptyTitle(mode)}
            subtitle={q ? "Prueba con otra palabra clave." : emptySub(mode)}
          />
        )}

        {listForUI.filter(Boolean).map((c) => (
          <ChallengeRow
            key={c.id}
            c={c}
            expanded={expandedId === c.id}
            onToggle={() =>
              setExpandedId((prev) => (prev === c.id ? undefined : c.id))
            }
            onJoin={() => join(c.id)}
            onAccept={() => accept(c.id)}
            onLeave={() => leave(c.id)}
            onDelete={() => remove(c.id)}
            onInvite={() => setInviteFor(c.id)}
          />
        ))}
      </section>

      {/* Modal de invitaciones */}
      {challengeToInvite && (
        <InviteFriends
          challenge={challengeToInvite}
          onCancel={() => setInviteFor(undefined)}
          onSave={(p) => saveInvites(challengeToInvite.id, p)}
        />
      )}
    </div>
  );
}

/* ========================= UI helpers ========================= */
function emptyTitle(m: Mode) {
  return m === "activos"
    ? "Sin retos activos"
    : m === "disponibles"
      ? "No hay disponibles"
      : "Aún no has vencido retos";
}
function emptySub(m: Mode) {
  return m === "activos" ? "Únete a uno disponible." : undefined;
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border,#e5e7eb)",
        borderRadius: 12,
        padding: "8px 10px",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function ChallengeRow({
  c,
  expanded,
  onToggle,
  onJoin,
  onAccept,
  onLeave,
  onDelete,
  onInvite,
}: {
  c: Challenge;
  expanded: boolean;
  onToggle: () => void;
  onJoin: () => void;
  onAccept: () => void;
  onLeave: () => void;
  onDelete: () => void;
  onInvite: () => void;
}) {
  // Paro defensivo
  if (!c) return null;

  // Defaults seguros
  const visibility = c?.visibility ?? "global";
  const isPrivate = visibility === "privado";
  const invitedMe = invitedMeFor(c);

  const prizeEnabled = isPrivate && c?.prizeConfig?.model === "entry_fee";
  const entryFee = prizeEnabled ? (c?.prizeConfig?.entryFee ?? 0) : 0;
  const prizePool = prizeEnabled ? (c?.participants ?? 0) * entryFee : 0;

  const dleft = daysLeft(c?.endDate);

  // Badge
  const badge = (
    <div
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        fontSize: 12,
        fontWeight: 700,
        padding: "4px 8px",
        borderRadius: 999,
        background: isPrivate ? "rgba(99,102,241,.15)" : "rgba(16,185,129,.15)",
        border: `1px solid ${
          isPrivate ? "rgba(99,102,241,.5)" : "rgba(16,185,129,.5)"
        }`,
        color: isPrivate ? "#6366f1" : "#10b981",
      }}
    >
      {isPrivate ? "Privado" : "Público"}
    </div>
  );

  return (
    <div className="card" style={{ marginTop: 12, position: "relative" }}>
      <div
        className="accent"
        style={{
          background:
            c.status === "activo"
              ? "var(--primary,#00B3A6)"
              : c.status === "disponible"
                ? "var(--blue,#3B82F6)"
                : "var(--border,#e5e7eb)",
        }}
      />
      {badge}

      {/* Fila compacta */}
      <button
        onClick={onToggle}
        className="btn"
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          padding: 0,
        }}
      >
        <div className="h3" style={{ marginBottom: 6 }}>
          {c.title}
        </div>
        <div style={{ color: "#6b7280", marginBottom: 8 }}>{c.description}</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 8,
          }}
        >
          <InfoPill label="Participantes" value={String(c.participants ?? 0)} />
          <InfoPill
            label="Vigencia"
            value={formatVigencia(c?.startDate, c?.endDate)}
          />
          <InfoPill
            label="Fee"
            value={prizeEnabled ? `$${entryFee.toLocaleString("es-MX")}` : "—"}
          />
          <InfoPill
            label="Premio acum."
            value={prizeEnabled ? `$${prizePool.toLocaleString("es-MX")}` : "—"}
          />
        </div>

        {c.status === "disponible" && isPrivate && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: invitedMe ? "#10b981" : "#6b7280",
            }}
          >
            {invitedMe
              ? "Tienes invitación pendiente"
              : "Reto privado — se requiere invitación"}
          </div>
        )}

        {typeof dleft === "number" && dleft <= 3 && dleft >= 0 && (
          <div style={{ marginTop: 6, fontSize: 12, color: "#ef4444" }}>
            ¡Termina en {dleft} {dleft === 1 ? "día" : "días"}!
          </div>
        )}
      </button>

      {/* Detalle al expandir */}
      {expanded && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700 }}>Reglas</div>
          <ul style={{ marginTop: 6 }}>
            {(c.rules ?? []).map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>

          {/* Invitados + Link único (solo en detalle) */}
          {isPrivate && (c.invited?.length ?? 0) > 0 && (
            <div className="card" style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Invitados</div>
              <div>{(c.invited ?? []).join(", ")}</div>
              {c.inviteCode && (
                <>
                  <div style={{ fontWeight: 700, marginTop: 8 }}>
                    Link de invitación
                  </div>
                  <div
                    className="btn"
                    style={{ wordBreak: "break-all", marginTop: 4 }}
                  >
                    {`${window.location.origin}/join?c=${c.id}&code=${c.inviteCode}`}
                  </div>
                  <button
                    className="btn"
                    style={{ marginTop: 8 }}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `${window.location.origin}/join?c=${c.id}&code=${c.inviteCode}`,
                        );
                        alert("Link copiado");
                      } catch {}
                    }}
                  >
                    Copiar link
                  </button>
                </>
              )}
            </div>
          )}

          {/* Leaderboard (mock) */}
          {c.leaderboard?.length ? (
            <div className="card" style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Leaderboard
              </div>
              {c.leaderboard.map((l, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {idx + 1}. {l.user}
                  </span>
                  <span>{l.score}</span>
                </div>
              ))}
            </div>
          ) : null}

          {/* Acciones */}
          <div
            style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}
          >
            {c.status === "disponible" && (
              <>
                {visibility === "global" && (
                  <button className="btn primary" onClick={onJoin}>
                    Unirme
                  </button>
                )}
                {visibility === "privado" && invitedMe && (
                  <button className="btn primary" onClick={onAccept}>
                    Aceptar invitación
                  </button>
                )}
                {c.createdByMe && (
                  <>
                    <button className="btn" onClick={onInvite}>
                      Invitar amigos
                    </button>
                    <button
                      className="btn"
                      onClick={onDelete}
                      style={{ borderColor: "#ef4444", color: "#ef4444" }}
                    >
                      Eliminar reto
                    </button>
                  </>
                )}
              </>
            )}

            {c.status === "activo" && (
              <button
                className="btn"
                onClick={onLeave}
                style={{ borderColor: "#ef4444", color: "#ef4444" }}
              >
                Salir del reto
              </button>
            )}

            {isPrivate && c?.prizeConfig?.model === "entry_fee" && (
              <button className="btn disabled" disabled title="Próximamente">
                Pagar entrada (próximamente)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card" style={{ marginTop: 12, textAlign: "center" }}>
      <div className="h3">{title}</div>
      {subtitle && <p style={{ color: "#6b7280" }}>{subtitle}</p>}
    </div>
  );
}
