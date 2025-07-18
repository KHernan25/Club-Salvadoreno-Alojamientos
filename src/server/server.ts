import dotenv from "dotenv";
import { app } from "./app";
import { dbManager } from "./database/connection";
import { config } from "../lib/config";

// Cargar variables de entorno
dotenv.config();

// Función para inicializar el servidor
async function startServer() {
  try {
    // Inicializar base de datos
    await dbManager.initialize();
    console.log("✅ Base de datos inicializada correctamente");

    // Iniciar servidor
    app.listen(config.server.port, () => {
      console.log(
        `🚀 Servidor Club Salvadoreño API ejecutándose en puerto ${config.server.port}`,
      );
      console.log(
        `📋 Health check: http://localhost:${config.server.port}/health`,
      );
      console.log(
        `🔧 API Base URL: http://localhost:${config.server.port}/api`,
      );
      console.log(`🌍 Entorno: ${config.server.nodeEnv}`);
      console.log(`🔗 Frontend URL: ${config.server.frontendUrl}`);
    });
  } catch (error) {
    console.error("❌ Error al inicializar el servidor:", error);
    process.exit(1);
  }
}

// Inicializar servidor
startServer();

// Manejo de cierre graceful
process.on("SIGTERM", async () => {
  console.log("🛑 Recibida señal SIGTERM, cerrando servidor...");
  await dbManager.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 Recibida señal SIGINT, cerrando servidor...");
  await dbManager.close();
  process.exit(0);
});
