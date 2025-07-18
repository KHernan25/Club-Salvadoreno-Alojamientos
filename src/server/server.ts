import dotenv from "dotenv";
// Cargar variables de entorno
dotenv.config();

import { app } from "./app";
import initializeDemoData from "./scripts/init-database";
import { config } from "../lib/config";

// Inicializar datos de demostración
initializeDemoData();

// Iniciar servidor
app.listen(config.server.port, () => {
  console.log(
    `🚀 Servidor Club Salvadoreño API ejecutándose en puerto ${config.server.port}`,
  );
  console.log(`📋 Health check: http://localhost:${config.server.port}/health`);
  console.log(`🔧 API Base URL: http://localhost:${config.server.port}/api`);
  console.log(`🌍 Entorno: ${config.server.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.server.frontendUrl}`);
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
