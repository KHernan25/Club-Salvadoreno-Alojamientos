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
