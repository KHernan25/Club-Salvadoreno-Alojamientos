// Base de datos de usuarios registrados
// En una aplicación real, esto vendría de una API/base de datos

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string; // En producción, esto debería estar hasheado
  email: string;
  phone: string;
  fullName: string;
  role:
    | "super_admin"
    | "atencion_miembro"
    | "anfitrion"
    | "monitor"
    | "mercadeo"
    | "user";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Lista de usuarios registrados
export const registeredUsers: User[] = [
  // Super Admin
  {
    id: "1",
    firstName: "Super",
    lastName: "Administrador",
    username: "superadmin",
    password: "SuperAdmin123",
    email: "superadmin@clubsalvadoreno.com",
    phone: "+503 2345-6789",
    fullName: "Super Administrador",
    role: "super_admin",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },

  // Atención al Miembro
  {
    id: "2",
    firstName: "Ana",
    lastName: "García",
    username: "atencion",
    password: "Atencion123",
    email: "atencion@clubsalvadoreno.com",
    phone: "+503 2345-6790",
    fullName: "Ana García - Atención al Miembro",
    role: "atencion_miembro",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },

  // Anfitrión
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Rodríguez",
    username: "anfitrion",
    password: "Anfitrion123",
    email: "anfitrion@clubsalvadoreno.com",
    phone: "+503 2345-6791",
    fullName: "Carlos Rodríguez - Anfitrión",
    role: "anfitrion",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },

  // Monitor
  {
    id: "4",
    firstName: "David",
    lastName: "López",
    username: "monitor",
    password: "Monitor123",
    email: "monitor@clubsalvadoreno.com",
    phone: "+503 2345-6792",
    fullName: "David López - Monitor",
    role: "monitor",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },

  // Mercadeo
  {
    id: "5",
    firstName: "Elena",
    lastName: "Martínez",
    username: "mercadeo",
    password: "Mercadeo123",
    email: "mercadeo@clubsalvadoreno.com",
    phone: "+503 2345-6793",
    fullName: "Elena Martínez - Mercadeo",
    role: "mercadeo",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },

  // Usuarios Regulares
  {
    id: "6",
    firstName: "María José",
    lastName: "González",
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
    id: "7",
    firstName: "Carlos",
    lastName: "Rivera",
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
    id: "8",
    firstName: "Ana",
    lastName: "Martínez",
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
    id: "9",
    firstName: "Juan",
    lastName: "Pérez",
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
    id: "10",
    firstName: "Demo",
    lastName: "Usuario",
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
    id: "11",
    firstName: "Inactivo",
    lastName: "Usuario",
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
  usernameOrEmail: string,
  password: string,
): User | null => {
  // Buscar por username o email
  let user = findUserByUsername(usernameOrEmail);

  // Si no se encuentra por username, buscar por email
  if (!user) {
    user = findUserByEmail(usernameOrEmail);
  }

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

// Interfaz para datos de nuevo usuario
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

export interface RegistrationResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Verificar si un email está disponible
export const isEmailAvailable = (email: string): boolean => {
  return !registeredUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
};

// Verificar si un username está disponible
export const isUsernameAvailable = (username: string): boolean => {
  return !registeredUsers.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
};

// Generar ID único para nuevo usuario
const generateUserId = (): string => {
  const maxId = Math.max(...registeredUsers.map((user) => parseInt(user.id)));
  return (maxId + 1).toString();
};

// Generar username único desde email
const generateUsernameFromEmail = (email: string): string => {
  const baseUsername = email.split("@")[0].toLowerCase();
  let username = baseUsername;
  let counter = 1;

  // Si ya existe, agregar número
  while (!isUsernameAvailable(username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

// Formatear número de teléfono
const formatPhone = (phone: string): string => {
  // Asegurar formato +503 XXXX-XXXX
  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.length === 8) {
    return `+503 ${cleaned.substring(0, 4)}-${cleaned.substring(4)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("503")) {
    const number = cleaned.substring(3);
    return `+503 ${number.substring(0, 4)}-${number.substring(4)}`;
  }

  return phone; // Devolver original si no se puede formatear
};

// Registrar nuevo usuario
export const registerNewUser = (userData: NewUserData): RegistrationResult => {
  const {
    firstName,
    lastName,
    email,
    documentType,
    documentNumber,
    memberCode,
    phone,
    password,
  } = userData;

  // Verificar que el email no exista
  if (!isEmailAvailable(email)) {
    return {
      success: false,
      error: "Este correo electrónico ya está registrado",
    };
  }

  // Generar username único
  const username = generateUsernameFromEmail(email);

  // Crear nuevo usuario
  const newUser: User = {
    id: generateUserId(),
    firstName,
    lastName,
    username,
    password, // En producción, esto debería estar hasheado
    email: email.toLowerCase(),
    phone: formatPhone(phone),
    fullName: `${firstName} ${lastName}`,
    role: "user", // Nuevos usuarios son "user" por defecto
    isActive: true,
    createdAt: new Date(),
  };

  // Agregar a la lista de usuarios
  registeredUsers.push(newUser);

  console.log("🎉 Nuevo usuario registrado:", {
    username: newUser.username,
    email: newUser.email,
    fullName: newUser.fullName,
  });

  return {
    success: true,
    user: newUser,
  };
};

// Obtener usuarios registrados recientemente (para debugging)
export const getRecentlyRegisteredUsers = (): User[] => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return registeredUsers.filter(
    (user) => user.createdAt && user.createdAt > oneHourAgo,
  );
};
