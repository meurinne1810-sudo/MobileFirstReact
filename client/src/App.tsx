// client/src/App.tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import BottomTabs from "./components/ui/BottomTabs";
import Home from "./pages/Home";
import Retos from "./pages/Retos";
import Causas from "./pages/Causas";
import Premios from "./pages/Premios";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import { useSession } from "./hooks/useSession";

function Shell() {
  return (
    <>
      <div style={{ paddingBottom: 72 }}>
        <Outlet />
      </div>
      <BottomTabs />
    </>
  );
}

function RequireAuth() {
  const { user, loading } = useSession();
  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50%" }}>Cargando…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Shell />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas privadas */}
        <Route element={<RequireAuth />}>
          <Route index element={<Home />} />
          <Route path="/retos" element={<Retos />} />
          <Route path="/causas" element={<Causas />} />
          <Route path="/premios" element={<Premios />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Auth públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
