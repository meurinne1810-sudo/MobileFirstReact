import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (isLogin) {
      // 🔹 LOGIN (usuario ya existente)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else window.location.href = "/home"; // ✅ redirige al Home después de login
    } else {
      // 🔹 REGISTRO (nuevo usuario)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else setMessage("📩 Revisa tu correo para confirmar tu cuenta.");
    }
  };

  const handleOAuth = async (provider: "google" | "apple" | "facebook") => {
    // 🔹 LOGIN / SIGNUP con OAuth
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/home` }, // ✅ redirige a /home
    });
    if (error) setMessage(error.message);
  };

  return (
    <div className="login-page">
      <h1>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Entrar" : "Registrarme"}</button>
      </form>

      <p style={{ color: "#f97316", marginTop: "10px" }}>{message}</p>

      <div className="oauth-buttons">
        <button onClick={() => handleOAuth("google")}>
          Continuar con Google
        </button>
        <button onClick={() => handleOAuth("apple")}>
          Continuar con Apple
        </button>
        <button onClick={() => handleOAuth("facebook")}>
          Continuar con Facebook
        </button>
      </div>

      <p style={{ marginTop: "20px" }}>
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <span
          style={{ color: "#f97316", cursor: "pointer" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Regístrate" : "Inicia sesión"}
        </span>
      </p>
    </div>
  );
}
