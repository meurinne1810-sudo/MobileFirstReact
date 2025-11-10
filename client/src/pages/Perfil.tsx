import { useSession } from "../hooks/useSession";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Perfil() {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  if (loading) return <div className="card">Cargando...</div>;

  return (
    <div className="card" style={{ margin: 16, padding: 24 }}>
      {user ? (
        <>
          <h2>@{user.email}</h2>
          <button
            className="btn"
            style={{ marginTop: 16 }}
            onClick={() => supabase.auth.signOut()}
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <p>No has iniciado sesión.</p>
      )}
    </div>
  );
}
