#!/usr/bin/env node

/**
 * Script de configuración automática para desarrollo
 * Club Salvadoreño - Sistema de Alojamientos
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Configurando entorno de desarrollo para Club Salvadoreño...\n");

// 1. Verificar si existe .env, si no crear desde .env.example
if (!fs.existsSync(".env")) {
  if (fs.existsSync(".env.example")) {
    fs.copyFileSync(".env.example", ".env");
    console.log("✅ Archivo .env creado desde .env.example");
  } else {
    console.log("⚠️ No se encontró .env.example, creando .env básico...");
    const basicEnv = `# Configuración básica para desarrollo
DATABASE_URL=sqlite:./data/club_salvadoreno.db
DB_TYPE=sqlite
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:8080
JWT_SECRET=club-salvadoreno-dev-secret-change-in-production
`;
    fs.writeFileSync(".env", basicEnv);
    console.log("✅ Archivo .env básico creado");
  }
} else {
  console.log("✅ Archivo .env ya existe");
}

// 2. Crear directorio de datos si no existe
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("✅ Directorio data/ creado");
} else {
  console.log("✅ Directorio data/ ya existe");
}

// 3. Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Directorio uploads/ creado");
} else {
  console.log("✅ Directorio uploads/ ya existe");
}

// 4. Crear directorio de logs si no existe
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log("✅ Directorio logs/ creado");
} else {
  console.log("✅ Directorio logs/ ya existe");
}

// 5. Verificar dependencias
console.log("\n📦 Verificando dependencias...");
try {
  execSync("npm list --depth=0", { stdio: "pipe" });
  console.log("✅ Dependencias instaladas correctamente");
} catch (error) {
  console.log("⚠️ Algunas dependencias pueden estar faltando");
  console.log("💡 Ejecuta: npm install");
}

// 6. Intentar compilar TypeScript
console.log("\n🔧 Verificando compilación TypeScript...");
try {
  execSync("npx tsc --noEmit", { stdio: "pipe" });
  console.log("✅ TypeScript compila correctamente");
} catch (error) {
  console.log("⚠️ Hay errores de TypeScript que revisar");
}

// 7. Mostrar configuración recomendada
console.log("\n📋 CONFIGURACIÓN COMPLETADA\n");
console.log("🔧 Para usar MySQL (recomendado para datos reales):");
console.log("   1. Instala MySQL en tu sistema");
console.log(
  "   2. Crea la base de datos: CREATE DATABASE club_salvadoreno_db;",
);
console.log("   3. Actualiza .env:");
console.log(
  "      DATABASE_URL=mysql://root:@localhost:3306/club_salvadoreno_db",
);
console.log("      DB_TYPE=mysql");
console.log("   4. Ejecuta: npm run server:dev");
console.log("");

console.log("🔧 Para usar SQLite (más fácil para desarrollo):");
console.log("   1. No requiere instalación adicional");
console.log("   2. Mantén .env como está (DB_TYPE=sqlite)");
console.log("   3. Ejecuta: npm run server:dev");
console.log("");

console.log("🚀 COMANDOS DISPONIBLES:");
console.log("   npm run dev          - Iniciar frontend (Vite)");
console.log("   npm run server:dev   - Iniciar backend con recarga automática");
console.log("   npm run dev:full     - Iniciar frontend + backend juntos");
console.log("   npm test             - Ejecutar tests");
console.log("   npm run typecheck    - Verificar tipos TypeScript");
console.log("");

console.log("👥 USUARIOS POR DEFECTO (contraseña: admin123):");
console.log("   Super Admin:         admin");
console.log("   Atención al Miembro: ghernandez");
console.log("   Anfitrión:           mgarcia");
console.log("   Miembro:             crodriguez");
console.log("");

console.log("🏨 CARACTERÍSTICAS DEL SISTEMA:");
console.log("   ✅ Precios por temporada (Baja/Alta/Asueto)");
console.log("   ✅ 20+ alojamientos en El Sunzal y Corinto");
console.log("   ✅ Calendario de feriados de El Salvador");
console.log("   ✅ Sistema completo de reservas");
console.log("   ✅ Gestión de usuarios y roles");
console.log("   ✅ Sistema de reseñas y mensajería");
console.log("   ✅ Control de acceso y portería");
console.log("   ✅ Facturación de acompañantes");
console.log("");

console.log("📖 Para más información:");
console.log(
  "   - API Docs: http://localhost:3001/api (cuando el servidor esté corriendo)",
);
console.log("   - Health Check: http://localhost:3001/health");
console.log("   - Aplicación: http://localhost:8080 (después de npm run dev)");
console.log("");

console.log("🎉 ¡Configuración completa! Ya puedes comenzar a desarrollar.");
console.log(
  '💡 Recomendación: Ejecuta "npm run dev:full" para iniciar todo junto.',
);
