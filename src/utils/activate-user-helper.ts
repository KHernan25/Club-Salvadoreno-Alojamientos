import {
  registeredUsers,
  findUserByEmail,
  findUserByUsername,
  type User,
} from "@/lib/user-database";

// Interface for status report
interface UserStatusReport {
  summary: {
    total: number;
    active: number;
    inactive: number;
  };
  inactiveUsers: User[];
  activeUsers: User[];
}

// Interface for activation result
interface ActivationResult {
  success: boolean;
  message: string;
  activatedCount?: number;
}

/**
 * Get a status report of all users in the system
 */
export function getUserStatusReport(): UserStatusReport {
  const allUsers = registeredUsers;

  const activeUsers = allUsers.filter((user) => user.isActive);
  const inactiveUsers = allUsers.filter((user) => !user.isActive);

  return {
    summary: {
      total: allUsers.length,
      active: activeUsers.length,
      inactive: inactiveUsers.length,
    },
    inactiveUsers,
    activeUsers,
  };
}

/**
 * Activate a user by email or username
 */
export function activateUserByIdentifier(identifier: string): ActivationResult {
  let user = findUserByUsername(identifier);

  if (!user) {
    user = findUserByEmail(identifier);
  }

  if (!user) {
    return {
      success: false,
      message: `Usuario no encontrado: ${identifier}`,
    };
  }

  if (user.isActive) {
    return {
      success: false,
      message: `Usuario ${user.fullName} ya está activo`,
    };
  }

  // Activate the user (directly modify the object since it's in-memory)
  user.isActive = true;

  return {
    success: true,
    message: `Usuario ${user.fullName} ha sido activado exitosamente`,
  };
}

/**
 * Activate all inactive users in the system
 */
export function activateAllInactiveUsers(): ActivationResult {
  const allUsers = registeredUsers;
  const inactiveUsers = allUsers.filter((user) => !user.isActive);

  if (inactiveUsers.length === 0) {
    return {
      success: false,
      message: "No hay usuarios inactivos para activar",
    };
  }

  let activatedCount = 0;

  for (const user of inactiveUsers) {
    user.isActive = true;
    activatedCount++;
  }

  return {
    success: true,
    message: `${activatedCount} usuarios han sido activados`,
    activatedCount,
  };
}
