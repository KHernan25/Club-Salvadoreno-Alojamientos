// Sistema de internacionalización para múltiples idiomas

export type Language = "es" | "en" | "fr";

export interface Translations {
  // Navegación
  nav: {
    myProfile: string;
    logout: string;
    language: string;
  };

  // Autenticación
  auth: {
    login: string;
    register: string;
    forgotPassword: string;
    resetPassword: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    rememberMe: string;
    loginButton: string;
    registerButton: string;
    welcomeBack: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    memberCode: string;
    acceptTerms: string;
    termsAndConditions: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    accommodations: string;
    reservations: string;
    myReservations: string;
    profile: string;
    clubName: string;
    accommodationReservations: string;
    // Hero descriptions
    corintoHeroDescription: string;
    elSunzalHeroDescription: string;
    countryClubHeroDescription: string;
    learnMore: string;
    // Welcome section
    welcomeDescription: string;
    welcomeSubtitle: string;
    // Activities
    activitiesTitle: string;
    surf: string;
    surfDescription: string;
    golf: string;
    golfDescription: string;
    tennis: string;
    tennisDescription: string;
    sailing: string;
    sailingDescription: string;
    // Dependencies/Accommodations section
    dependenciesTitle: string;
    seeDetails: string;
    // Corinto
    corintoSubtitle: string;
    corintoDescription: string;
    // El Sunzal
    elSunzalSubtitle: string;
    elSunzalDescription: string;
    // Country Club
    countryClubSubtitle: string;
    countryClubDescription: string;
  };

  // Acomodaciones
  accommodations: {
    title: string;
    available: string;
    occupied: string;
    maintenance: string;
    viewDetails: string;
    makeReservation: string;
    apartment: string;
    house: string;
    suite: string;
    nights: string;
    guests: string;
    amenities: string;
  };

  // Reservaciones
  reservations: {
    title: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    totalNights: string;
    totalCost: string;
    confirm: string;
    cancel: string;
    pending: string;
    confirmed: string;
    cancelled: string;
    completed: string;
  };

  // Perfil
  profile: {
    title: string;
    personalInfo: string;
    contactInfo: string;
    preferences: string;
    save: string;
    edit: string;
    changePassword: string;
    notifications: string;
  };

  // Ubicaciones
  locations: {
    corinto: string;
    elSunzal: string;
    countryClub: string;
    houses: string;
    apartments: string;
    suites: string;
  };

  // Mensajes comunes
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    open: string;
    search: string;
    filter: string;
    sort: string;
    noResults: string;
  };

  // Validaciones y errores
  validation: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    passwordTooShort: string;
    passwordsNotMatch: string;
    invalidCredentials: string;
    accountDeactivated: string;
    userNotFound: string;
    emailAlreadyExists: string;
  };
}

// Traducciones en Español
const esTranslations: Translations = {
  nav: {
    myProfile: "Mi Perfil",
    logout: "Cerrar Sesión",
    language: "Idioma",
  },

  auth: {
    login: "Iniciar Sesión",
    register: "Registrarse",
    forgotPassword: "¿Olvidaste tu contraseña?",
    resetPassword: "Restablecer Contraseña",
    username: "Usuario",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    email: "Correo Electrónico",
    phone: "Teléfono",
    rememberMe: "Recordarme",
    loginButton: "Iniciar Sesión",
    registerButton: "Crear Cuenta",
    welcomeBack: "Bienvenido de vuelta",
    createAccount: "Crear nueva cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿Aún no tienes una cuenta?",
    firstName: "Nombre",
    lastName: "Apellidos",
    documentType: "Tipo de Documento",
    documentNumber: "Número de Documento",
    memberCode: "Código de Miembro",
    acceptTerms: "Acepto los términos y condiciones",
    termsAndConditions: "Términos y Condiciones",
  },

  dashboard: {
    welcome: "Bienvenido",
    accommodations: "Alojamientos",
    reservations: "Reservaciones",
    myReservations: "Mis Reservas",
    profile: "Perfil",
    clubName: "Club Salvadoreño",
    accommodationReservations: "Reservas de Alojamientos",
    // Hero descriptions
    corintoHeroDescription:
      "Descubre la tranquilidad del lago en nuestro refugio natural, donde la serenidad se encuentra con la aventura.",
    elSunzalHeroDescription:
      "El conjunto ideal del alojamiento, Sol, mar y vida nocturna en un ambiente. Disfruta sus mejores playas, preciosas paisajes de vaste y la diversión de El Salvador.",
    countryClubHeroDescription:
      "Un espacio exclusivo en la ciudad para disfrutar deportes y entretenimiento. Donde las familias se reúnen para disfrutar de excelencia.",
    learnMore: "Conoce más",
    // Welcome section
    welcomeDescription:
      "En el Club Salvadoreño celebramos nuestro hogar, nuestra tradición para la artesanía tradicional, eventos sociales, deportes y actividades. Ubicado en zonas para disfrute de los miembros salvadoreños desde donde se puede disfrutar de la riqueza cultural que nos caracteriza en forma de ubicación.",
    welcomeSubtitle: "Te damos la bienvenida a tu Club, tu hogar de descanso.",
    // Activities
    activitiesTitle: "Actividades",
    surf: "Surf",
    surfDescription:
      "Disfruta de las mejores olas en las playas de El Salvador",
    golf: "Golf",
    golfDescription: "Campo de golf profesional con vistas espectaculares",
    tennis: "Tenis",
    tennisDescription:
      "Canchas de tenis de clase mundial para tu entretenimiento",
    sailing: "Vela",
    sailingDescription: "Navega por las cristalinas aguas del Lago de Ilopango",
    // Dependencies/Accommodations section
    dependenciesTitle: "DEPENDENCIAS",
    seeDetails: "Ver Detalles",
    // Corinto
    corintoSubtitle:
      "Relájate de la velocidad del lago al tiempo de recreo, donde el",
    corintoDescription:
      "mundo más tranquilo es disponible para descanso entre los habitantes acuáticos y disfruta tu",
    // El Sunzal
    elSunzalSubtitle:
      "Escápate del surf oceanográfico. El Sunzal te espera con sus",
    elSunzalDescription:
      "perfectos rompientes, ambiente y la experiencia perfecta para familia amantes.",
    // Country Club
    countryClubSubtitle:
      "Un espacio exclusivo en la ciudad para disfrutar deportes y",
    countryClubDescription:
      "entretenimiento. Donde las familias se reúnen para disfrutar de excelencia y entretenimiento.",
  },

  accommodations: {
    title: "Alojamientos Disponibles",
    available: "Disponible",
    occupied: "Ocupado",
    maintenance: "Mantenimiento",
    viewDetails: "Ver Detalles",
    makeReservation: "Hacer Reserva",
    apartment: "Apartamento",
    house: "Casa",
    suite: "Suite",
    nights: "noches",
    guests: "huéspedes",
    amenities: "Amenidades",
  },

  reservations: {
    title: "Reservaciones",
    checkIn: "Entrada",
    checkOut: "Salida",
    guests: "Huéspedes",
    totalNights: "Total de Noches",
    totalCost: "Costo Total",
    confirm: "Confirmar",
    cancel: "Cancelar",
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  },

  profile: {
    title: "Mi Perfil",
    personalInfo: "Información Personal",
    contactInfo: "Información de Contacto",
    preferences: "Preferencias",
    save: "Guardar",
    edit: "Editar",
    changePassword: "Cambiar Contraseña",
    notifications: "Notificaciones",
  },

  locations: {
    corinto: "Corinto",
    elSunzal: "El Sunzal",
    countryClub: "Country Club",
    houses: "Casas",
    apartments: "Apartamentos",
    suites: "Suites",
  },

  common: {
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    save: "Guardar",
    edit: "Editar",
    delete: "Eliminar",
    confirm: "Confirmar",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    close: "Cerrar",
    open: "Abrir",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    noResults: "No se encontraron resultados",
  },

  validation: {
    required: "Este campo es obligatorio",
    invalidEmail: "Por favor ingresa un correo electrónico válido",
    invalidPhone: "Por favor ingresa un número de teléfono válido",
    passwordTooShort: "La contraseña debe tener al menos 8 caracteres",
    passwordsNotMatch: "Las contraseñas no coinciden",
    invalidCredentials: "Credenciales inválidas",
    accountDeactivated: "Tu cuenta está desactivada",
    userNotFound: "Usuario no encontrado",
    emailAlreadyExists: "Este correo electrónico ya está registrado",
  },
};

// Traducciones en Inglés
const enTranslations: Translations = {
  nav: {
    myProfile: "My Profile",
    logout: "Log Out",
    language: "Language",
  },

  auth: {
    login: "Sign In",
    register: "Sign Up",
    forgotPassword: "Forgot your password?",
    resetPassword: "Reset Password",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    email: "Email",
    phone: "Phone",
    rememberMe: "Remember me",
    loginButton: "Sign In",
    registerButton: "Create Account",
    welcomeBack: "Welcome back",
    createAccount: "Create new account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account yet?",
    firstName: "First Name",
    lastName: "Last Name",
    documentType: "Document Type",
    documentNumber: "Document Number",
    memberCode: "Member Code",
    acceptTerms: "I accept the terms and conditions",
    termsAndConditions: "Terms and Conditions",
  },

  dashboard: {
    welcome: "Welcome",
    accommodations: "Accommodations",
    reservations: "Reservations",
    myReservations: "My Reservations",
    profile: "Profile",
    clubName: "Salvadoran Club",
    accommodationReservations: "Accommodation Reservations",
  },

  accommodations: {
    title: "Available Accommodations",
    available: "Available",
    occupied: "Occupied",
    maintenance: "Maintenance",
    viewDetails: "View Details",
    makeReservation: "Make Reservation",
    apartment: "Apartment",
    house: "House",
    suite: "Suite",
    nights: "nights",
    guests: "guests",
    amenities: "Amenities",
  },

  reservations: {
    title: "Reservations",
    checkIn: "Check In",
    checkOut: "Check Out",
    guests: "Guests",
    totalNights: "Total Nights",
    totalCost: "Total Cost",
    confirm: "Confirm",
    cancel: "Cancel",
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
  },

  profile: {
    title: "My Profile",
    personalInfo: "Personal Information",
    contactInfo: "Contact Information",
    preferences: "Preferences",
    save: "Save",
    edit: "Edit",
    changePassword: "Change Password",
    notifications: "Notifications",
  },

  locations: {
    corinto: "Corinto",
    elSunzal: "El Sunzal",
    countryClub: "Country Club",
    houses: "Houses",
    apartments: "Apartments",
    suites: "Suites",
  },

  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    open: "Open",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    noResults: "No results found",
  },

  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid phone number",
    passwordTooShort: "Password must be at least 8 characters",
    passwordsNotMatch: "Passwords do not match",
    invalidCredentials: "Invalid credentials",
    accountDeactivated: "Your account is deactivated",
    userNotFound: "User not found",
    emailAlreadyExists: "This email address is already registered",
  },
};

// Traducciones en Francés
const frTranslations: Translations = {
  nav: {
    myProfile: "Mon Profil",
    logout: "Se Déconnecter",
    language: "Langue",
  },

  auth: {
    login: "Se Connecter",
    register: "S'inscrire",
    forgotPassword: "Mot de passe oublié?",
    resetPassword: "Réinitialiser le Mot de Passe",
    username: "Nom d'utilisateur",
    password: "Mot de Passe",
    confirmPassword: "Confirmer le Mot de Passe",
    email: "Email",
    phone: "Téléphone",
    rememberMe: "Se souvenir de moi",
    loginButton: "Se Connecter",
    registerButton: "Créer un Compte",
    welcomeBack: "Bon retour",
    createAccount: "Créer un nouveau compte",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    dontHaveAccount: "Vous n'avez pas encore de compte?",
    firstName: "Prénom",
    lastName: "Nom de Famille",
    documentType: "Type de Document",
    documentNumber: "Numéro de Document",
    memberCode: "Code de Membre",
    acceptTerms: "J'accepte les termes et conditions",
    termsAndConditions: "Termes et Conditions",
  },

  dashboard: {
    welcome: "Bienvenue",
    accommodations: "Hébergements",
    reservations: "Réservations",
    myReservations: "Mes Réservations",
    profile: "Profil",
    clubName: "Club Salvadorien",
    accommodationReservations: "Réservations d'Hébergement",
  },

  accommodations: {
    title: "Hébergements Disponibles",
    available: "Disponible",
    occupied: "Occupé",
    maintenance: "Maintenance",
    viewDetails: "Voir les Détails",
    makeReservation: "Faire une Réservation",
    apartment: "Appartement",
    house: "Maison",
    suite: "Suite",
    nights: "nuits",
    guests: "invités",
    amenities: "Commodités",
  },

  reservations: {
    title: "Réservations",
    checkIn: "Arrivée",
    checkOut: "Départ",
    guests: "Invités",
    totalNights: "Total des Nuits",
    totalCost: "Coût Total",
    confirm: "Confirmer",
    cancel: "Annuler",
    pending: "En Attente",
    confirmed: "Confirmée",
    cancelled: "Annulée",
    completed: "Terminée",
  },

  profile: {
    title: "Mon Profil",
    personalInfo: "Informations Personnelles",
    contactInfo: "Informations de Contact",
    preferences: "Préférences",
    save: "Sauvegarder",
    edit: "Modifier",
    changePassword: "Changer le Mot de Passe",
    notifications: "Notifications",
  },

  locations: {
    corinto: "Corinto",
    elSunzal: "El Sunzal",
    countryClub: "Country Club",
    houses: "Maisons",
    apartments: "Appartements",
    suites: "Suites",
  },

  common: {
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    save: "Sauvegarder",
    edit: "Modifier",
    delete: "Supprimer",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    close: "Fermer",
    open: "Ouvrir",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    noResults: "Aucun résultat trouvé",
  },

  validation: {
    required: "Ce champ est obligatoire",
    invalidEmail: "Veuillez entrer une adresse email valide",
    invalidPhone: "Veuillez entrer un numéro de téléphone valide",
    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
    passwordsNotMatch: "Les mots de passe ne correspondent pas",
    invalidCredentials: "Identifiants invalides",
    accountDeactivated: "Votre compte est désactivé",
    userNotFound: "Utilisateur non trouvé",
    emailAlreadyExists: "Cette adresse email est déjà enregistrée",
  },
};

// Mapeo de traducciones
export const translations: Record<Language, Translations> = {
  es: esTranslations,
  en: enTranslations,
  fr: frTranslations,
};

// Idiomas disponibles con sus metadatos
export const availableLanguages = [
  { code: "es" as Language, name: "Español", flag: "🇸🇻" },
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
];

// Función para obtener las traducciones de un idioma
export const getTranslations = (language: Language): Translations => {
  return translations[language] || translations.es;
};

// Función para obtener el idioma desde localStorage o usar por defecto
export const getStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem("preferred-language");
    if (stored && Object.keys(translations).includes(stored)) {
      return stored as Language;
    }
  } catch (error) {
    console.error("Error reading stored language:", error);
  }
  return "es"; // Idioma por defecto
};

// Función para guardar el idioma en localStorage
export const setStoredLanguage = (language: Language): void => {
  try {
    localStorage.setItem("preferred-language", language);
  } catch (error) {
    console.error("Error storing language:", error);
  }
};
