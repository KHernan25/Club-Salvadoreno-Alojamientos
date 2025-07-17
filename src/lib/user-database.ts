// Base de datos de usuarios registrados
// En una aplicación real, esto vendría de una API/base de datos

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string; // En producción, esto deber��a estar hasheado
  email: string;
  phone: string;
  fullName: string;
  role:
    | "super_admin"
    | "atencion_miembro"
    | "anfitrion"
    | "monitor"
    | "mercadeo"
    | "recepcion"
    | "porteria"
    | "miembro";
  isActive: boolean;
  status?: "pending" | "approved" | "rejected";
  memberStatus?: "activo" | "inactivo" | "en_mora"; // Estado específico para miembros
  membershipType?:
    | "Viuda"
    | "Honorario"
    | "Fundador"
    | "Visitador Transeunte"
    | "Visitador Especial"
    | "Visitador Juvenil"
    | "Contribuyente"; // Tipo de membresía
  lastLogin?: Date;
  createdAt: Date;
  profileImage?: string;
  documents?: {
    idDocument?: string; // URL de la foto del documento de identidad
    memberCard?: string; // URL de la foto del carnet de miembro
    facePhoto?: string; // URL de la foto del rostro
    uploadedAt?: Date;
  };
}

// Definir permisos por rol
export interface RolePermissions {
  canViewDashboard: boolean;
  canManageUsers: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
  canManageAccommodations: boolean;
  canManageReservations: boolean;
  canManageCalendar: boolean;
  canManagePricing: boolean;
  canManageMessages: boolean;
  canManageSettings: boolean;
  canAccessAllLocations: boolean;
  canCreateRoles: boolean;
  canEditSiteContent: boolean; // Nuevo permiso para editar contenido del sitio
  canManageImages: boolean; // Nuevo permiso para gestionar imágenes
  canManageAccessControl: boolean; // Gestionar control de acceso
  canViewAccessHistory: boolean; // Ver historial de accesos
  canDetectMembers: boolean; // Detectar miembros en pluma de acceso
  canRegisterCompanions: boolean; // Registrar acompañantes
  canViewReports: boolean; // Ver módulo de reportes
}

export const getRolePermissions = (role: User["role"]): RolePermissions => {
  switch (role) {
    case "super_admin":
      return {
        canViewDashboard: true,
        canManageUsers: true,
        canCreateUsers: true,
        canUpdateUsers: true,
        canDeleteUsers: true,
        canManageAccommodations: true,
        canManageReservations: true,
        canManageCalendar: true,
        canManagePricing: true,
        canManageMessages: true,
        canManageSettings: true,
        canAccessAllLocations: true,
        canCreateRoles: true,
        canEditSiteContent: true,
        canManageImages: true,
        canManageAccessControl: true,
        canViewAccessHistory: true,
        canDetectMembers: true,
        canRegisterCompanions: true,
        canViewReports: true,
      };
    case "atencion_miembro":
      return {
        canViewDashboard: true,
        canManageUsers: true,
        canCreateUsers: false,
        canUpdateUsers: true,
        canDeleteUsers: false,
        canManageAccommodations: false,
        canManageReservations: true,
        canManageCalendar: true,
        canManagePricing: false,
        canManageMessages: true,
        canManageSettings: false,
        canAccessAllLocations: true,
        canCreateRoles: false,
        canEditSiteContent: false,
        canManageImages: false,
        canManageAccessControl: false,
        canViewAccessHistory: true,
        canDetectMembers: false,
        canRegisterCompanions: false,
        canViewReports: true,
      };
    case "anfitrion":
      return {
        canViewDashboard: true,
        canManageUsers: false,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canManageAccommodations: true,
        canManageReservations: true,
        canManageCalendar: true,
        canManagePricing: false,
        canManageMessages: true,
        canManageSettings: false,
        canAccessAllLocations: false,
        canCreateRoles: false,
        canEditSiteContent: false,
        canManageImages: true, // Anfitriones pueden gestionar imágenes de alojamientos
        canManageAccessControl: false,
        canViewAccessHistory: false,
        canDetectMembers: false,
        canRegisterCompanions: true,
      };
    case "monitor":
      return {
        canViewDashboard: true,
        canManageUsers: false,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canManageAccommodations: false,
        canManageReservations: true,
        canManageCalendar: true,
        canManagePricing: false,
        canManageMessages: false,
        canManageSettings: false,
        canAccessAllLocations: false,
        canCreateRoles: false,
        canEditSiteContent: false,
        canManageImages: false,
        canManageAccessControl: false,
        canViewAccessHistory: false,
        canDetectMembers: false,
        canRegisterCompanions: false,
      };
    case "mercadeo":
      return {
        canViewDashboard: true,
        canManageUsers: false,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canManageAccommodations: true, // Puede editar información de alojamientos
        canManageReservations: false,
        canManageCalendar: false,
        canManagePricing: false,
        canManageMessages: true,
        canManageSettings: true, // Puede editar configuración del sitio
        canAccessAllLocations: true,
        canCreateRoles: false,
        canEditSiteContent: true, // Permiso específico para editar contenido del sitio
        canManageImages: true, // Permiso específico para gestionar imágenes
        canManageAccessControl: false,
        canViewAccessHistory: false,
        canDetectMembers: false,
        canRegisterCompanions: false,
      };
    case "recepcion":
      return {
        canViewDashboard: true,
        canManageUsers: false,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canManageAccommodations: false,
        canManageReservations: true,
        canManageCalendar: true,
        canManagePricing: false,
        canManageMessages: true,
        canManageSettings: false,
        canAccessAllLocations: true,
        canCreateRoles: false,
        canEditSiteContent: false,
        canManageImages: false,
        canManageAccessControl: false,
        canViewAccessHistory: false,
        canDetectMembers: false,
        canRegisterCompanions: true,
      };
    case "porteria":
      return {
        canViewDashboard: true,
        canManageUsers: false,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canManageAccommodations: false,
        canManageReservations: false,
        canManageCalendar: false,
        canManagePricing: false,
        canManageMessages: false,
        canManageSettings: false,
        canAccessAllLocations: false,
        canCreateRoles: false,
        canEditSiteContent: false,
        canManageImages: false,
        canManageAccessControl: true,
        canViewAccessHistory: true,
        canDetectMembers: true,
        canRegisterCompanions: true,
      };
    default:
      return {
        canViewDashboard: false,
        canManageUsers: false,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canManageAccommodations: false,
        canManageReservations: false,
        canManageCalendar: false,
        canManagePricing: false,
        canManageMessages: false,
        canManageSettings: false,
        canAccessAllLocations: false,
        canCreateRoles: false,
        canEditSiteContent: false,
        canManageImages: false,
        canManageAccessControl: false,
        canViewAccessHistory: false,
        canDetectMembers: false,
        canRegisterCompanions: false,
      };
  }
};

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
    email: "carlos.rodriguez@email.com",
    phone: "+503 2345-6791",
    fullName: "Carlos Rodríguez",
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

  // Recepción
  {
    id: "11",
    firstName: "Sofia",
    lastName: "Herrera",
    username: "recepcion",
    password: "Recepcion123",
    email: "recepcion@clubsalvadoreno.com",
    phone: "+503 2345-6794",
    fullName: "Sofia Herrera - Recepción",
    role: "recepcion",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },

  // Miembros
  {
    id: "6",
    firstName: "María José",
    lastName: "González",
    username: "usuario1",
    password: "Usuario123",
    email: "usuario1@email.com",
    phone: "+503 7234-5678",
    fullName: "María José González",
    role: "miembro",
    isActive: true,
    status: "approved",
    memberStatus: "activo",
    membershipType: "Contribuyente",
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
    role: "miembro",
    isActive: true,
    status: "approved",
    memberStatus: "activo",
    membershipType: "Fundador",
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
    role: "miembro",
    isActive: true,
    status: "approved",
    memberStatus: "en_mora",
    membershipType: "Honorario",
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
    role: "miembro",
    isActive: false,
    status: "approved",
    memberStatus: "inactivo",
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
    role: "miembro",
    isActive: true,
    status: "approved",
    memberStatus: "activo",
    createdAt: new Date("2024-01-01"),
  },

  // Portero
  {
    id: "11",
    firstName: "Roberto",
    lastName: "Portillo",
    username: "portero",
    password: "Portero123",
    email: "portero@clubsalvadoreno.com",
    phone: "+503 7890-1234",
    fullName: "Roberto Portillo",
    role: "porteria",
    isActive: true,
    status: "approved",
    memberStatus: "activo",
    lastLogin: new Date("2024-01-15T08:00:00Z"),
    createdAt: new Date("2024-01-01T09:00:00Z"),
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },

  // Usuario inactivo (para testing)
  {
    id: "12",
    firstName: "Inactivo",
    lastName: "Usuario",
    username: "inactivo",
    password: "Inactivo123",
    email: "inactivo@email.com",
    phone: "+503 7234-5683",
    fullName: "Usuario Inactivo",
    role: "miembro",
    isActive: false,
    memberStatus: "inactivo",
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
  message?: string;
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
    role: "miembro",
    isActive: false, // Los nuevos usuarios están inactivos hasta ser aprobados
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
