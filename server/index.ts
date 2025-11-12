import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ⚙️ Necesario para que __dirname funcione en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧱 Servir archivos estáticos del cliente (Vite build)
app.use(express.static(path.join(__dirname, "../client/dist")));

// 📄 Fallback para SPA (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// 🚀 Puerto dinámico (Render) o 3000 local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
