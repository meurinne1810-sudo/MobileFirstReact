// client/src/components/ui/BottomTabs.tsx
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Inicio" },
  { to: "/retos", label: "Retos" },
  { to: "/causas", label: "Causa" },
  { to: "/premios", label: "Premios" },
  { to: "/perfil", label: "Perfil" },
];

export default function BottomTabs() {
  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "var(--card,#111827)",
        borderTop: "1px solid var(--border,#1f2937)",
        display: "grid",
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        padding: "10px 8px",
        zIndex: 50,
      }}
    >
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === "/"}
          className={({ isActive }) => "btn" + (isActive ? " on" : "")}
          style={{
            textAlign: "center",
            background: "transparent",
            border: "none",
          }}
          aria-label={t.label}
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
