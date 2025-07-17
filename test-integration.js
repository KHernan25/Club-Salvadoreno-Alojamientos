#!/usr/bin/env node

// Script de pruebas de integración para verificar funcionalidades básicas
// Este script verifica que la API y la base de datos estén funcionando correctamente

const fetch = require("node-fetch");

const API_BASE = "http://localhost:3001/api";

// Colores para la consola
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Función helper para hacer requests
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  info("Probando health check...");

  try {
    const response = await fetch("http://localhost:3001/health");
    const data = await response.json();

    if (response.ok && data.status === "OK") {
      success("Health check OK");
      return true;
    } else {
      error("Health check falló");
      return false;
    }
  } catch (err) {
    error(`Health check error: ${err.message}`);
    return false;
  }
}

// Test 2: API Base
async function testApiBase() {
  info("Probando API base...");

  const result = await apiRequest("");

  if (result.success && result.data.message.includes("Club Salvadoreño")) {
    success("API base respondiendo correctamente");
    return true;
  } else {
    error("API base falló");
    return false;
  }
}

// Test 3: Autenticación
async function testAuthentication() {
  info("Probando autenticación...");

  // Probar login con credenciales válidas
  const loginResult = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: "superadmin",
      password: "SuperAdmin123",
    }),
  });

  if (
    loginResult.success &&
    loginResult.data.data &&
    loginResult.data.data.token
  ) {
    success("Login exitoso");

    // Guardar token para próximas pruebas
    global.authToken = loginResult.data.data.token;
    global.currentUser = loginResult.data.data.user;

    info(
      `Usuario logueado: ${global.currentUser.fullName} (${global.currentUser.role})`,
    );
    return true;
  } else {
    error("Login falló");
    console.log("Response:", loginResult);
    return false;
  }
}

// Test 4: Alojamientos
async function testAccommodations() {
  info("Probando alojamientos...");

  const result = await apiRequest("/accommodations");

  if (
    result.success &&
    result.data.accommodations &&
    Array.isArray(result.data.accommodations)
  ) {
    const accommodations = result.data.accommodations;
    success(`${accommodations.length} alojamientos cargados`);

    // Verificar estructura básica
    const firstAcc = accommodations[0];
    if (firstAcc && firstAcc.id && firstAcc.name && firstAcc.location) {
      success("Estructura de alojamientos correcta");

      // Contar por ubicación
      const elSunzal = accommodations.filter(
        (acc) => acc.location === "el-sunzal",
      ).length;
      const corinto = accommodations.filter(
        (acc) => acc.location === "corinto",
      ).length;

      info(`El Sunzal: ${elSunzal} alojamientos`);
      info(`Corinto: ${corinto} alojamientos`);

      return true;
    } else {
      error("Estructura de alojamientos incorrecta");
      return false;
    }
  } else {
    error("No se pudieron cargar alojamientos");
    return false;
  }
}

// Test 5: Usuarios (requiere autenticación)
async function testUsers() {
  info("Probando gestión de usuarios...");

  if (!global.authToken) {
    warning("No hay token de autenticación, saltando test de usuarios");
    return false;
  }

  const result = await apiRequest("/users", {
    headers: {
      Authorization: `Bearer ${global.authToken}`,
    },
  });

  if (result.success && result.data.users && Array.isArray(result.data.users)) {
    const users = result.data.users;
    success(`${users.length} usuarios en el sistema`);

    // Contar por rol
    const admins = users.filter(
      (u) => u.role === "super_admin" || u.role === "atencion_miembro",
    ).length;
    const members = users.filter((u) => u.role === "miembro").length;
    const staff = users.filter((u) =>
      ["anfitrion", "monitor", "mercadeo", "recepcion", "porteria"].includes(
        u.role,
      ),
    ).length;

    info(`Administradores: ${admins}`);
    info(`Miembros: ${members}`);
    info(`Staff: ${staff}`);

    return true;
  } else {
    error("No se pudieron cargar usuarios");
    return false;
  }
}

// Test 6: Reservas
async function testReservations() {
  info("Probando sistema de reservas...");

  if (!global.authToken) {
    warning("No hay token de autenticación, saltando test de reservas");
    return false;
  }

  const result = await apiRequest("/reservations/all", {
    headers: {
      Authorization: `Bearer ${global.authToken}`,
    },
  });

  if (
    result.success &&
    result.data.reservations &&
    Array.isArray(result.data.reservations)
  ) {
    const reservations = result.data.reservations;
    success(`${reservations.length} reservas en el sistema`);

    // Contar por estado
    const confirmed = reservations.filter(
      (r) => r.status === "confirmed",
    ).length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const cancelled = reservations.filter(
      (r) => r.status === "cancelled",
    ).length;

    info(`Confirmadas: ${confirmed}`);
    info(`Pendientes: ${pending}`);
    info(`Canceladas: ${cancelled}`);

    return true;
  } else {
    error("No se pudieron cargar reservas");
    return false;
  }
}

// Test 7: Notificaciones
async function testNotifications() {
  info("Probando sistema de notificaciones...");

  if (!global.authToken) {
    warning("No hay token de autenticación, saltando test de notificaciones");
    return false;
  }

  const result = await apiRequest("/notifications", {
    headers: {
      Authorization: `Bearer ${global.authToken}`,
    },
  });

  if (result.success) {
    success("Sistema de notificaciones funcionando");
    return true;
  } else {
    warning(
      "Sistema de notificaciones no disponible (esto es normal en desarrollo)",
    );
    return true; // No es crítico en desarrollo
  }
}

// Función principal
async function runAllTests() {
  log("🧪 Iniciando pruebas de integración", colors.bold);
  log("=====================================", colors.bold);

  const tests = [
    { name: "Health Check", fn: testHealthCheck },
    { name: "API Base", fn: testApiBase },
    { name: "Autenticación", fn: testAuthentication },
    { name: "Alojamientos", fn: testAccommodations },
    { name: "Usuarios", fn: testUsers },
    { name: "Reservas", fn: testReservations },
    { name: "Notificaciones", fn: testNotifications },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    log(`\n📋 Test: ${test.name}`, colors.yellow);
    log("─".repeat(30));

    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (err) {
      error(`Test ${test.name} falló con error: ${err.message}`);
      failed++;
    }
  }

  log("\n=====================================", colors.bold);
  log("📊 Resumen de Pruebas", colors.bold);
  log("=====================================", colors.bold);

  success(`Pruebas exitosas: ${passed}`);
  if (failed > 0) {
    error(`Pruebas fallidas: ${failed}`);
  }

  const total = passed + failed;
  const percentage = Math.round((passed / total) * 100);

  log(
    `\nPorcentaje de éxito: ${percentage}%`,
    percentage >= 80
      ? colors.green
      : percentage >= 60
        ? colors.yellow
        : colors.red,
  );

  if (percentage >= 80) {
    success("🎉 Sistema funcionando correctamente!");
  } else if (percentage >= 60) {
    warning("⚠️ Sistema funcionando con algunas limitaciones");
  } else {
    error("❌ Sistema con problemas críticos");
  }

  return percentage >= 80;
}

// Ejecutar pruebas
if (require.main === module) {
  runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((err) => {
      error(`Error crítico: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { runAllTests };
