// client/src/lib/storage.ts
export type Post = {
  id: string;
  user: string;
  type: "ejercicio"|"alimentacion"|"recuperacion"|"salud_mental"|"habito";
  text: string;
  createdAt: number;
};

const KEY = "be_feed";

export function loadFeed(): Post[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Post[] : seed();
  } catch {
    return seed();
  }
}

export function saveFeed(list: Post[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function seed(): Post[] {
  // posts de ejemplo iniciales
  return [
    { id: crypto.randomUUID(), user: "María",  type: "ejercicio",     text: "Yoga suave al amanecer 🧘‍♀️",   createdAt: Date.now()-3600e3 },
    { id: crypto.randomUUID(), user: "Carlos", type: "salud_mental",  text: "Caminé 20 min sin audífonos 🌿", createdAt: Date.now()-2*3600e3 },
  ];
}