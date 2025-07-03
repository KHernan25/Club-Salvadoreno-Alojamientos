// Utilidad helper para activar usuarios desactivados
// Solo para uso en desarrollo y debugging

import {
  registeredUsers,
  findUserByEmail,
  findUserByUsername,
} from "@/lib/user-database";

export interface UserActivationResult {
  success: boolean;
  message: string;
  user?: {
    username: string;
    email: string;
    fullName: string;
    isActive: boolean;
  };
}

/**
 * Activa un usuario específico por email o username
 */
export const activateUserByIdentifier = (
  identifier: string,
): UserActivationResult => {
  // Buscar por email o username
  const user = findUserByEmail(identifier) || findUserByUsername(identifier);

  if (!user) {
    return {
      success: false,
      message: `Usuario no encontrado con el identificador: ${identifier}`,
    };
  }

  if (user.isActive) {
    return {
      success: false,
      message: `El usuario ${user.fullName} ya está activo`,
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      },
    };
  }

  // Activar usuario
  user.isActive = true;

  return {
    success: true,
    message: `Usuario ${user.fullName} activado exitosamente`,
    user: {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
    },
  };
};

/**
 * Activa todos los usuarios desactivados
 */
export const activateAllInactiveUsers = (): {
  success: boolean;
  message: string;
  activatedCount: number;
  activatedUsers: Array<{ username: string; email: string; fullName: string }>;
} => {
  const inactiveUsers = registeredUsers.filter((user) => !user.isActive);

  if (inactiveUsers.length === 0) {
    return {
      success: false,
      message: "No hay usuarios inactivos para activar",
      activatedCount: 0,
      activatedUsers: [],
    };
  }

  // Activar todos los usuarios inactivos
  inactiveUsers.forEach((user) => {
    user.isActive = true;
  });

  const activatedUsers = inactiveUsers.map((user) => ({
    username: user.username,
    email: user.email,
    fullName: user.fullName,
  }));

  return {
    success: true,
    message: `Se activaron ${inactiveUsers.length} usuarios exitosamente`,
    activatedCount: inactiveUsers.length,
    activatedUsers,
  };
};

/**
 * Lista usuarios activos e inactivos para debugging
 */
export const getUserStatusReport = () => {
  const activeUsers = registeredUsers.filter((user) => user.isActive);
  const inactiveUsers = registeredUsers.filter((user) => !user.isActive);

  return {
    summary: {
      total: registeredUsers.length,
      active: activeUsers.length,
      inactive: inactiveUsers.length,
    },
    activeUsers: activeUsers.map((user) => ({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    })),
    inactiveUsers: inactiveUsers.map((user) => ({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    })),
  };
};

/**
 * Función para uso en consola del navegador - debugging
 */
export const debugUserActivation = () => {
  const report = getUserStatusReport();

  console.group("🔧 User Activation Debug Helper");
  console.log("📊 Status Report:", report.summary);

  if (report.inactiveUsers.length > 0) {
    console.group("❌ Inactive Users:");
    report.inactiveUsers.forEach((user) => {
      console.log(`- ${user.fullName} (${user.username}) - ${user.email}`);
    });
    console.groupEnd();

    console.log("\n💡 Para activar un usuario específico:");
    console.log("window.activateUser('email@ejemplo.com')");
    console.log("\n💡 Para activar todos los usuarios:");
    console.log("window.activateAllUsers()");
  } else {
    console.log("✅ All users are active!");
  }

  console.group("✅ Active Users:");
  report.activeUsers.forEach((user) => {
    console.log(
      `- ${user.fullName} (${user.username}) - ${user.email} [${user.role}]`,
    );
  });
  console.groupEnd();

  console.groupEnd();

  return report;
};

// Funciones globales para usar en consola del navegador
if (typeof window !== "undefined") {
  (window as any).activateUser = activateUserByIdentifier;
  (window as any).activateAllUsers = activateAllInactiveUsers;
  (window as any).debugUsers = debugUserActivation;
  (window as any).getUserReport = getUserStatusReport;
}
