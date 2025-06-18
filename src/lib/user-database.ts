// Base de datos de usuarios registrados
// En una aplicación real, esto vendría de una API/base de datos

export interface User {
  id: string;
  username: string;
  password: string; // En producción, esto debería estar hasheado
  email: string;
  phone: string;
  fullName: string;
  role: "admin" | "user" | "staff";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Lista de usuarios registrados
export const registeredUsers: User[] = [
  // Usuarios Admin
  {
    id: "1",
    username: "admin",
    password: "Admin123",
    email: "admin@clubsalvadoreno.com",
    phone: "+503 2345-6789",
    fullName: "Administrador del Sistema",
    role: "admin",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    username: "gerente",
    password: "Gerente2024",
    email: "gerente@clubsalvadoreno.com",
    phone: "+503 2345-6790",
    fullName: "Gerente General",
    role: "admin",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },

  // Staff
  {
    id: "3",
    username: "recepcion",
    password: "Recepcion123",
    email: "recepcion@clubsalvadoreno.com",
    phone: "+503 2345-6791",
    fullName: "Personal de Recepción",
    role: "staff",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },

  // Usuarios Regulares
  {
    id: "4",
    username: "usuario1",
    password: "Usuario123",
    email: "usuario1@email.com",
    phone: "+503 7234-5678",
    fullName: "María José González",
    role: "user",
    isActive: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "5",
    username: "carlos.rivera",
    password: "Carlos2024",
    email: "carlos.rivera@email.com",
    phone: "+503 7234-5679",
    fullName: "Carlos Rivera",
    role: "user",
    isActive: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "6",
    username: "ana.martinez",
    password: "Ana123456",
    email: "ana.martinez@email.com",
    phone: "+503 7234-5680",
    fullName: "Ana Martínez",
    role: "user",
    isActive: true,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "7",
    username: "jperez",
    password: "JuanP123",
    email: "juan.perez@email.com",
    phone: "+503 7234-5681",
    fullName: "Juan Pérez",
    role: "user",
    isActive: true,
    createdAt: new Date("2024-03-01"),
  },

  // Usuario de prueba común
  {
    id: "8",
    username: "demo",
    password: "demo123",
    email: "demo@clubsalvadoreno.com",
    phone: "+503 7234-5682",
    fullName: "Usuario de Demostración",
    role: "user",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },

  // Usuario inactivo (para testing)
  {
    id: "9",
    username: "inactivo",
    password: "Inactivo123",
    email: "inactivo@email.com",
    phone: "+503 7234-5683",
    fullName: "Usuario Inactivo",
    role: "user",
    isActive: false,
    createdAt: new Date("2024-01-01"),
  },
];

// Funciones helper
export const findUserByUsername = (username: string): User | undefined => {
  return registeredUsers.find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
};

export const findUserByEmail = (email: string): User | undefined => {
  return registeredUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
};

export const findUserById = (id: string): User | undefined => {
  return registeredUsers.find((user) => user.id === id);
};

export const isValidUser = (
  username: string,
  password: string,
): User | null => {
  const user = findUserByUsername(username);

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  return user;
};

// Para propósitos de demostración, exportamos las credenciales disponibles
export const getAvailableCredentials = () => {
  return registeredUsers
    .filter((user) => user.isActive)
    .map((user) => ({
      username: user.username,
      password: user.password,
      role: user.role,
      fullName: user.fullName,
    }));
};

// Simulación de actualización de último login
export const updateLastLogin = (userId: string): void => {
  const user = findUserById(userId);
  if (user) {
    user.lastLogin = new Date();
  }
};

// Clave para localStorage donde se guardan usuarios registrados
const REGISTERED_USERS_KEY = "club_salvadoreno_registered_users";

// Obtener usuarios registrados desde localStorage
export const getRegisteredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading registered users:", error);
    return [];
  }
};

// Guardar usuarios registrados en localStorage
const saveRegisteredUsers = (users: User[]): void => {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving registered users:", error);
  }
};

// Obtener todos los usuarios (predefinidos + registrados)
export const getAllUsers = (): User[] => {
  const registeredUsers = getRegisteredUsers();
  return [...registeredUsers, ...registeredUsers];
};

// Verificar si username ya existe
export const isUsernameAvailable = (username: string): boolean => {
  const allUsers = [...registeredUsers, ...getRegisteredUsers()];
  return !allUsers.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
};

// Verificar si email ya existe
export const isEmailAvailable = (email: string): boolean => {
  const allUsers = [...registeredUsers, ...getRegisteredUsers()];
  return !allUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
};

// Generar ID único para nuevo usuario
const generateUserId = (): string => {
  const allUsers = [...registeredUsers, ...getRegisteredUsers()];
  const maxId = Math.max(...allUsers.map((user) => parseInt(user.id, 10)), 0);
  return (maxId + 1).toString();
};

// Registrar nuevo usuario
export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  documentNumber: string;
  memberCode: string;
  phone: string;
  password: string;
}

export const registerNewUser = (
  userData: NewUserData,
): { success: boolean; user?: User; error?: string } => {
  // Validar que username sea único (usar email como username)
  const username = userData.email.split("@")[0]; // Usar parte del email como username

  if (!isUsernameAvailable(username)) {
    return { success: false, error: "El nombre de usuario ya está en uso" };
  }

  if (!isEmailAvailable(userData.email)) {
    return {
      success: false,
      error: "El correo electrónico ya está registrado",
    };
  }

  // Crear nuevo usuario
  const newUser: User = {
    id: generateUserId(),
    username,
    password: userData.password,
    email: userData.email,
    phone: userData.phone,
    fullName: `${userData.firstName} ${userData.lastName}`,
    role: "user", // Usuarios registrados son "user" por defecto
    isActive: true,
    createdAt: new Date(),
  };

  // Agregar a la lista de usuarios registrados
  const currentRegistered = getRegisteredUsers();
  const updatedUsers = [...currentRegistered, newUser];
  saveRegisteredUsers(updatedUsers);

  return { success: true, user: newUser };
};

// Actualizar funciones existentes para incluir usuarios registrados
export const findUserByUsernameWithRegistered = (
  username: string,
): User | undefined => {
  // Buscar primero en usuarios predefinidos
  let user = findUserByUsername(username);
  if (user) return user;

  // Buscar en usuarios registrados
  const registeredUsers = getRegisteredUsers();
  return registeredUsers.find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
};

export const findUserByEmailWithRegistered = (
  email: string,
): User | undefined => {
  // Buscar primero en usuarios predefinidos
  let user = findUserByEmail(email);
  if (user) return user;

  // Buscar en usuarios registrados
  const registeredUsers = getRegisteredUsers();
  return registeredUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
};

export const isValidUserWithRegistered = (
  username: string,
  password: string,
): User | null => {
  // Buscar en todos los usuarios (predefinidos + registrados)
  const user = findUserByUsernameWithRegistered(username);

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  return user;
};
