// client/src/lib/posts.ts
// ————————————————————————————————————————————————
// Modelo de Posts (LocalStorage) + eventos de cambio
// ————————————————————————————————————————————————

export type Category =
  | "deporte"
  | "nutricion"
  | "recuperacion"
  | "terapia"
  | "otro";

export type Post = {
  id: string;
  userId: string; // id del usuario (Supabase u otro)
  userHandle: string; // @alias para mostrar
  createdAt: string; // ISO
  text: string;
  category: Category;
  likes: number;
  likedByMe?: boolean;
  comments: Array<{
    id: string;
    userHandle: string;
    text: string;
    createdAt: string;
  }>;
  mediaUrl?: string; // opcional (imagen/video)
};

export type NewPost = Omit<
  Post,
  "id" | "createdAt" | "likes" | "comments" | "likedByMe"
> & {
  text: string;
  category: Category;
};

// Clave de almacenamiento y canal de eventos
const LS = "app.posts.v2";
const bus = new EventTarget();

// Utilidad pequeña para generar IDs
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Cargar lista desde LocalStorage (con migración mínima)
export function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(LS);
    if (!raw) return seedIfEmpty();

    const parsed: Post[] = JSON.parse(raw);
    // Mínima normalización
    return parsed.map((p) => ({
      likes: 0,
      comments: [],
      likedByMe: false,
      category: "otro",
      ...p,
    }));
  } catch {
    return seedIfEmpty();
  }
}

// Guardar lista completa
function saveAll(list: Post[]) {
  localStorage.setItem(LS, JSON.stringify(list));
  // Notificar a quien esté escuchando cambios
  bus.dispatchEvent(new CustomEvent("posts:changed", { detail: list }));
}

// Semillas de ejemplo si está vacío (para no ver feed en blanco)
function seedIfEmpty(): Post[] {
  const demo: Post[] = [
    {
      id: uid(),
      userId: "demo-1",
      userHandle: "@demoUser",
      createdAt: new Date().toISOString(),
      text: "Bienvenido a SportsCause — comparte tu .1% de hoy 💪",
      category: "deporte",
      likes: 2,
      likedByMe: false,
      comments: [],
    },
  ];
  saveAll(demo);
  return demo;
}

// Crear/guardar un post nuevo
export function savePost(newPost: NewPost): Post {
  const list = loadPosts();
  const post: Post = {
    id: uid(),
    createdAt: new Date().toISOString(),
    likes: 0,
    likedByMe: false,
    comments: [],
    ...newPost,
  };
  const next = [post, ...list];
  saveAll(next);
  return post;
}

// Eliminar
export function deletePost(id: string) {
  const list = loadPosts();
  saveAll(list.filter((p) => p.id !== id));
}

// Like / Unlike
export function toggleLike(id: string) {
  const list = loadPosts();
  const next = list.map((p) =>
    p.id === id
      ? {
          ...p,
          likedByMe: !p.likedByMe,
          likes: Math.max(0, p.likes + (!p.likedByMe ? 1 : -1)),
        }
      : p,
  );
  saveAll(next);
}

// Agregar comentario
export function addComment(postId: string, userHandle: string, text: string) {
  const list = loadPosts();
  const next = list.map((p) =>
    p.id === postId
      ? {
          ...p,
          comments: [
            ...p.comments,
            {
              id: uid(),
              userHandle,
              text,
              createdAt: new Date().toISOString(),
            },
          ],
        }
      : p,
  );
  saveAll(next);
}

// Escuchar cambios del feed (entre pestañas y dentro de la app)
// Devuelve una función para desuscribirse.
export function onPostsChanged(cb: (posts: Post[]) => void): () => void {
  // 1) Cambios internos (savePost / toggleLike / deletePost...)
  const handler = (e: Event) => {
    const list = loadPosts();
    cb(list);
  };
  bus.addEventListener("posts:changed", handler);

  // 2) Cambios desde otras pestañas/ventanas (evento "storage")
  const storageHandler = (e: StorageEvent) => {
    if (e.key === LS) {
      const list = loadPosts();
      cb(list);
    }
  };
  window.addEventListener("storage", storageHandler);

  // Llamada inicial con el estado actual
  cb(loadPosts());

  // Unsubscribe
  return () => {
    bus.removeEventListener("posts:changed", handler);
    window.removeEventListener("storage", storageHandler);
  };
}

// Helpers de filtro/búsqueda (opcional para Home)
export function filterByCategory(list: Post[], cat?: Category | "todos") {
  if (!cat || cat === "todos") return list;
  return list.filter((p) => p.category === cat);
}
export function searchInPosts(list: Post[], q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return list;
  return list.filter((p) => (p.text || "").toLowerCase().includes(t));
}
