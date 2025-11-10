// client/src/lib/challenges.ts

export type Leader = { user: string; score: number };

export type PrizeDistribution =
  | { type: "winner_takes_all" }
  | {
      type: "custom";
      splits: Array<{ place: number; percentage?: number; amount?: number }>;
    };

export type PrizeConfig = {
  model: "entry_fee";
  entryFee: number; // MXN
  distribution: PrizeDistribution;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  rules: string[];
  visibility: "global" | "privado";
  status: "activo" | "disponible" | "vencido";

  // Participación
  participants: number; // se sincroniza con members.length en el UI
  members?: string[]; // IDs/handles de participantes

  // Vigencia (ISO YYYY-MM-DD)
  startDate?: string;
  endDate?: string;

  // Premios (solo privados con fee de entrada)
  hasPrizes: boolean;
  prizes?: string[]; // legacy opcional (texto)
  prizeConfig?: PrizeConfig; // config real de premio

  // Invitaciones (MVP)
  invited?: string[]; // @usuario, email o teléfono
  inviteCode?: string; // token de invitación por reto

  leaderboard: Leader[];
  createdByMe?: boolean;
};

// Datos de ejemplo (seeds) — coherentes con la UI actual
export const seedChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Duerme 8h diarias",
    description: "Mejora tu descanso 7 días seguidos.",
    rules: ["Registra al menos una mejora diaria en 'recuperación'."],
    visibility: "global",
    status: "activo",
    participants: 3,
    members: ["@ana", "@luis", "@demo-user"],
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    hasPrizes: false,
    leaderboard: [
      { user: "Ana", score: 6 },
      { user: "Luis", score: 5 },
    ],
    createdByMe: false,
  },
  {
    id: "c2",
    title: "10,000 pasos diarios",
    description: "Camina a tu ritmo, suma constancia.",
    rules: ["Suma actividad de pasos cada día."],
    visibility: "global",
    status: "disponible",
    participants: 0,
    members: [],
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    hasPrizes: true,
    prizes: ["Gift cards", "Merch"],
    leaderboard: [],
    createdByMe: false,
  },
  {
    id: "c3",
    title: "50 km corriendo (mes)",
    description: "Divide tus entrenos como quieras.",
    rules: ["Solo cuenta 'run'."],
    visibility: "global",
    status: "disponible",
    participants: 0,
    members: [],
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    hasPrizes: true,
    prizes: ["Acceso a trivia mensual"],
    leaderboard: [],
    createdByMe: false,
  },
  {
    id: "c4",
    title: "200 km en bici (mes)",
    description: "Reto privado entre amigos.",
    rules: ["Solo cuenta 'ride'."],
    visibility: "privado",
    status: "disponible",
    participants: 12,
    members: ["@amigo1", "@amigo2", "@amigo3"],
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    hasPrizes: true,
    prizeConfig: {
      model: "entry_fee",
      entryFee: 200,
      distribution: { type: "winner_takes_all" },
    },
    invited: ["@demo-user", "@amigo4"],
    inviteCode: "abc123xy",
    leaderboard: [],
    createdByMe: false,
  },
  {
    id: "c5",
    title: "Reto semanal cerrado",
    description: "Quedó en la historia. ¿Listo para el siguiente?",
    rules: ["—"],
    visibility: "global",
    status: "vencido",
    participants: 2,
    members: ["@equipo1", "@equipo2"],
    startDate: "2025-09-01",
    endDate: "2025-09-07",
    hasPrizes: false,
    leaderboard: [{ user: "Equipo Norte", score: 100 }],
    createdByMe: false,
  },
];
