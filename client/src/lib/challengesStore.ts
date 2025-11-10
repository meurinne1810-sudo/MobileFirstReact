// client/src/lib/challengesStore.ts
import type { Challenge } from "./challenges";

/**
 * Clave en localStorage
 */
const LS = "app.challenges.v1";

/**
 * Normaliza cualquier objeto “viejo” o incompleto a un Challenge válido,
 * asegurando defaults para los campos nuevos (visibility, prizeConfig, etc.).
 */
function normalizeChallenge(raw: any): Challenge {
  return {
    id: String(raw?.id ?? globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`),
    title: String(raw?.title ?? "Reto"),
    description: String(raw?.description ?? ""),
    status:
      raw?.status === "activo" || raw?.status === "vencido"
        ? raw.status
        : "disponible",
    startDate: raw?.startDate || undefined,
    endDate: raw?.endDate || undefined,
    rules: Array.isArray(raw?.rules) ? raw.rules : [],
    participants: Number(raw?.participants ?? 0),

    // <- El fix importante: si falta, que sea "global"
    visibility: raw?.visibility === "privado" ? "privado" : "global",

    invited: Array.isArray(raw?.invited) ? raw.invited : [],
    inviteCode: raw?.inviteCode || undefined,

    // Normaliza prizeConfig (entry fee)
    prizeConfig:
      raw?.prizeConfig && raw.prizeConfig.model === "entry_fee"
        ? {
            model: "entry_fee",
            entryFee: Number(raw.prizeConfig.entryFee ?? 0),
          }
        : undefined,

    createdByMe: Boolean(raw?.createdByMe),
    leaderboard: Array.isArray(raw?.leaderboard) ? raw.leaderboard : [],
  };
}

/**
 * Carga y normaliza la lista de retos desde localStorage.
 */
export function loadChallenges(): Challenge[] {
  try {
    const txt = localStorage.getItem(LS);
    if (!txt) return [];
    const parsed = JSON.parse(txt);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeChallenge);
  } catch {
    return [];
  }
}

/**
 * Persistencia simple.
 */
export function saveChallenges(list: Challenge[]) {
  localStorage.setItem(LS, JSON.stringify(list));
}

/**
 * (Opcional) Útil si necesitas limpiar datos a mano desde código.
 */
export function clearChallenges() {
  localStorage.removeItem(LS);
}
