// client/src/lib/user.ts
export type User = {
  id: string; // p.ej. "@luis"
  name: string; // "Luis M."
  avatar?: string; // data URL o https
};

const LS_KEY = "app.user.v1";

export function loadUser(): User {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) return JSON.parse(raw);
  // usuario por defecto (anon)
  const u: User = { id: "@demo", name: "Invitado" };
  localStorage.setItem(LS_KEY, JSON.stringify(u));
  return u;
}

export function saveUser(u: User) {
  localStorage.setItem(LS_KEY, JSON.stringify(u));
}

export function currentUserId(): string {
  return loadUser().id;
}
