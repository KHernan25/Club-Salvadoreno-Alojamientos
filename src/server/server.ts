import dotenv from "dotenv";
import { app } from "./app";
import initializeDemoData from "./scripts/init-database";

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3001;

// Inicializar datos de demostración
initializeDemoData();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `🚀 Servidor Club Salvadoreño API ejecutándose en puerto ${PORT}`,
  );
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  console.log("🛑 Recibida señal SIGTERM, cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Recibida señal SIGINT, cerrando servidor...");
  process.exit(0);
});
