// Servicio de datos unificado para sincronizar información entre backoffice y sitio principal

export interface UnifiedAccommodation {
  id: string;
  name: string;
  type: "apartamento" | "casa" | "suite";
  location: "el-sunzal" | "corinto";
  capacity: number;
  description: string;
  amenities: string[];
  pricing: {
    weekday: number;
    weekend: number;
    holiday: number;
  };
  images: string[];
  available: boolean;
  view?: string;
  featured?: boolean;
  lastUpdated: string;
  updatedBy?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  lastLogin: string;
  preferences: {
    timezone: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      reservations: boolean;
      userRegistrations: boolean;
      systemUpdates: boolean;
    };
  };
}

// Datos centralizados que se sincronizan entre ambos sistemas
class UnifiedDataService {
  private accommodations: UnifiedAccommodation[] = [];
  private userProfiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Inicializar con datos completos del sistema
    this.accommodations = [
      // El Sunzal - Apartamentos
      {
        id: "1A",
        name: "Apartamento 1A",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 2,
        description:
          "Cómodo apartamento con vista directa al mar, perfecto para parejas. Ubicado en el primer piso con fácil acceso y todas las comodidades necesarias.",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
        pricing: { weekday: 110, weekend: 230, holiday: 280 },
        images: [
          "/images/apartamentos/1a-1.jpg",
          "/images/apartamentos/1a-2.jpg",
        ],
        available: true,
        view: "Vista al mar",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "1B",
        name: "Apartamento 1B",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 2,
        description:
          "Apartamento acogedor con vista parcial al mar. Ideal para una estancia romántica con todas las comodidades modernas.",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
        pricing: { weekday: 95, weekend: 210, holiday: 260 },
        images: [
          "/images/apartamentos/1b-1.jpg",
          "/images/apartamentos/1b-2.jpg",
        ],
        available: true,
        view: "Vista parcial",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "2A",
        name: "Apartamento 2A",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 4,
        description:
          "Espacioso apartamento para familias con vista premium al mar. Segundo piso con balcón privado y cocina completa.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina completa",
          "Balcón",
        ],
        pricing: { weekday: 120, weekend: 250, holiday: 300 },
        images: [
          "/images/apartamentos/2a-1.jpg",
          "/images/apartamentos/2a-2.jpg",
        ],
        available: true,
        view: "Vista al mar premium",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "2B",
        name: "Apartamento 2B",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 4,
        description:
          "Apartamento familiar con vista al jardín tropical. Perfecto para familias que buscan tranquilidad y confort.",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa"],
        pricing: { weekday: 105, weekend: 225, holiday: 275 },
        images: [
          "/images/apartamentos/2b-1.jpg",
          "/images/apartamentos/2b-2.jpg",
        ],
        available: true,
        view: "Vista jardín",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "3A",
        name: "Apartamento 3A",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 6,
        description:
          "Penthouse de lujo con todas las comodidades para grupos grandes. Vista panorámica espectacular y terraza privada con jacuzzi.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina gourmet",
          "Terraza",
          "Jacuzzi",
        ],
        pricing: { weekday: 180, weekend: 350, holiday: 450 },
        images: [
          "/images/apartamentos/3a-1.jpg",
          "/images/apartamentos/3a-2.jpg",
        ],
        available: true,
        view: "Penthouse",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "3B",
        name: "Apartamento 3B",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 6,
        description:
          "Amplio apartamento con vista lateral al mar. Excelente para grupos grandes con terraza amplia y múltiples comodidades.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina completa",
          "Terraza",
        ],
        pricing: { weekday: 160, weekend: 320, holiday: 400 },
        images: [
          "/images/apartamentos/3b-1.jpg",
          "/images/apartamentos/3b-2.jpg",
        ],
        available: true,
        view: "Vista lateral",
        lastUpdated: new Date().toISOString(),
      },

      // El Sunzal - Casas
      {
        id: "casa1",
        name: "Casa Surf Paradise",
        type: "casa",
        location: "el-sunzal",
        capacity: 6,
        description:
          "Casa diseñada especialmente para surfistas con acceso directo al break. Incluye almacenamiento para tablas y ducha exterior.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina completa",
          "Terraza",
          "Almacenamiento para tablas",
          "Ducha exterior",
        ],
        pricing: { weekday: 250, weekend: 450, holiday: 550 },
        images: ["/images/casas/casa1-1.jpg", "/images/casas/casa1-2.jpg"],
        available: true,
        view: "Frente al mar",
        featured: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "casa2",
        name: "Casa Familiar Deluxe",
        type: "casa",
        location: "el-sunzal",
        capacity: 8,
        description:
          "Casa amplia y familiar con todas las comodidades para grupos grandes. Jardín privado, BBQ y sala de juegos incluidos.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina gourmet",
          "Jardín privado",
          "BBQ",
          "Sala de juegos",
        ],
        pricing: { weekday: 300, weekend: 550, holiday: 650 },
        images: ["/images/casas/casa2-1.jpg", "/images/casas/casa2-2.jpg"],
        available: true,
        view: "Amplia vista",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "casa3",
        name: "Casa Vista Panorámica",
        type: "casa",
        location: "el-sunzal",
        capacity: 6,
        description:
          "Casa elevada con vista panorámica espectacular del océano. Jacuzzi exterior, terraza multinivel y hamacas.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina completa",
          "Jacuzzi exterior",
          "Terraza multinivel",
          "Hamacas",
        ],
        pricing: { weekday: 280, weekend: 500, holiday: 600 },
        images: ["/images/casas/casa3-1.jpg", "/images/casas/casa3-2.jpg"],
        available: true,
        view: "Panorámica elevada",
        featured: true,
        lastUpdated: new Date().toISOString(),
      },

      // El Sunzal - Suites (16 suites)
      ...Array.from({ length: 16 }, (_, i) => ({
        id: `suite${i + 1}`,
        name: `Suite Premium ${i + 1}`,
        type: "suite" as const,
        location: "el-sunzal" as const,
        capacity: 2 + Math.floor(i / 4),
        description: `Suite de lujo número ${i + 1} con servicios premium incluidos. Diseño elegante con vista panorámica al océano Pacífico.`,
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV Premium",
          "Minibar",
          "Room service",
          "Jacuzzi",
          "Balcón privado",
          "Servicio de limpieza",
        ],
        pricing: {
          weekday: 180 + i * 10,
          weekend: 320 + i * 15,
          holiday: 420 + i * 20,
        },
        images: [
          `/images/suites/suite-${i + 1}-1.jpg`,
          `/images/suites/suite-${i + 1}-2.jpg`,
        ],
        available: true,
        view: "Premium",
        featured: i < 4, // Primeras 4 suites destacadas
        lastUpdated: new Date().toISOString(),
      })),

      // Corinto - Solo Casas (6 casas)
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `corinto-casa-${i + 1}`,
        name: `Casa Corinto ${i + 1}`,
        type: "casa" as const,
        location: "corinto" as const,
        capacity: 4 + Math.floor(i / 2),
        description: `Casa moderna ${i + 1} en Corinto con vista al lago. Ambiente tranquilo y relajante perfecto para desconectarse de la rutina.`,
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina equipada",
          "Terraza",
          "Jardín",
          "BBQ",
        ],
        pricing: {
          weekday: 140 + i * 15,
          weekend: 280 + i * 25,
          holiday: 350 + i * 30,
        },
        images: [
          `/images/corinto/casa-${i + 1}-1.jpg`,
          `/images/corinto/casa-${i + 1}-2.jpg`,
        ],
        available: i !== 3, // Casa 4 no disponible
        view: "Vista lago",
        featured: i === 0 || i === 5, // Primera y última casa destacadas
        lastUpdated: new Date().toISOString(),
      })),
    ];
  }

  // Métodos para alojamientos
  getAllAccommodations(): UnifiedAccommodation[] {
    return [...this.accommodations];
  }

  getAccommodationsByLocation(
    location: "el-sunzal" | "corinto",
  ): UnifiedAccommodation[] {
    return this.accommodations.filter((acc) => acc.location === location);
  }

  getAccommodationsByType(
    type: "apartamento" | "casa" | "suite",
  ): UnifiedAccommodation[] {
    return this.accommodations.filter((acc) => acc.type === type);
  }

  getAccommodationById(id: string): UnifiedAccommodation | undefined {
    return this.accommodations.find((acc) => acc.id === id);
  }

  updateAccommodation(
    id: string,
    updates: Partial<UnifiedAccommodation>,
    updatedBy?: string,
  ): boolean {
    const index = this.accommodations.findIndex((acc) => acc.id === id);
    if (index === -1) return false;

    this.accommodations[index] = {
      ...this.accommodations[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
      updatedBy,
    };

    // Disparar evento de sincronización
    this.broadcastDataChange("accommodation_updated", { id, updates });
    return true;
  }

  addAccommodation(
    accommodation: Omit<UnifiedAccommodation, "lastUpdated">,
  ): boolean {
    const newAccommodation: UnifiedAccommodation = {
      ...accommodation,
      lastUpdated: new Date().toISOString(),
    };

    this.accommodations.push(newAccommodation);
    this.broadcastDataChange("accommodation_added", newAccommodation);
    return true;
  }

  deleteAccommodation(id: string): boolean {
    const index = this.accommodations.findIndex((acc) => acc.id === id);
    if (index === -1) return false;

    this.accommodations.splice(index, 1);
    this.broadcastDataChange("accommodation_deleted", { id });
    return true;
  }

  // Métodos para perfiles de usuario
  getUserProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  updateUserProfile(userId: string, updates: Partial<UserProfile>): boolean {
    const existing = this.userProfiles.get(userId);
    if (!existing) return false;

    const updated: UserProfile = {
      ...existing,
      ...updates,
    };

    this.userProfiles.set(userId, updated);
    this.broadcastDataChange("user_profile_updated", { userId, updates });
    return true;
  }

  updateProfileImage(userId: string, imageUrl: string): boolean {
    return this.updateUserProfile(userId, { profileImage: imageUrl });
  }

  // Sistema de sincronización
  private broadcastDataChange(type: string, data: any) {
    // Disparar evento personalizado para sincronizar con componentes
    const event = new CustomEvent("unifiedDataChange", {
      detail: { type, data, timestamp: new Date().toISOString() },
    });
    window.dispatchEvent(event);

    // En producción, aquí se haría la sincronización con el backend
    console.log(`[UnifiedDataService] ${type}:`, data);
  }

  // Métodos de estadísticas
  getStats() {
    const total = this.accommodations.length;
    const elSunzal = this.getAccommodationsByLocation("el-sunzal").length;
    const corinto = this.getAccommodationsByLocation("corinto").length;
    const available = this.accommodations.filter((acc) => acc.available).length;

    const avgPrice = Math.round(
      this.accommodations.reduce((sum, acc) => sum + acc.pricing.weekend, 0) /
        total,
    );

    return {
      total,
      elSunzal,
      corinto,
      available,
      unavailable: total - available,
      avgPrice,
      byType: {
        apartamento: this.getAccommodationsByType("apartamento").length,
        casa: this.getAccommodationsByType("casa").length,
        suite: this.getAccommodationsByType("suite").length,
      },
    };
  }

  // Filtros avanzados
  searchAccommodations(query: string): UnifiedAccommodation[] {
    const searchTerm = query.toLowerCase();
    return this.accommodations.filter(
      (acc) =>
        acc.name.toLowerCase().includes(searchTerm) ||
        acc.description.toLowerCase().includes(searchTerm) ||
        acc.amenities.some((amenity) =>
          amenity.toLowerCase().includes(searchTerm),
        ),
    );
  }

  getFilteredAccommodations(filters: {
    location?: string;
    type?: string;
    available?: boolean;
    minCapacity?: number;
    maxPrice?: number;
  }): UnifiedAccommodation[] {
    return this.accommodations.filter((acc) => {
      if (filters.location && acc.location !== filters.location) return false;
      if (filters.type && acc.type !== filters.type) return false;
      if (
        filters.available !== undefined &&
        acc.available !== filters.available
      )
        return false;
      if (filters.minCapacity && acc.capacity < filters.minCapacity)
        return false;
      if (filters.maxPrice && acc.pricing.weekend > filters.maxPrice)
        return false;
      return true;
    });
  }
}

// Instancia singleton
export const unifiedDataService = new UnifiedDataService();

// Hook para reactividad en React
export const useUnifiedData = () => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const handleDataChange = () => {
      setLastUpdate(Date.now());
    };

    window.addEventListener("unifiedDataChange", handleDataChange);
    return () =>
      window.removeEventListener("unifiedDataChange", handleDataChange);
  }, []);

  return {
    accommodations: unifiedDataService.getAllAccommodations(),
    stats: unifiedDataService.getStats(),
    lastUpdate,
    // Métodos utilitarios
    getAccommodationById: (id: string) =>
      unifiedDataService.getAccommodationById(id),
    updateAccommodation: (
      id: string,
      updates: Partial<UnifiedAccommodation>,
      updatedBy?: string,
    ) => unifiedDataService.updateAccommodation(id, updates, updatedBy),
    searchAccommodations: (query: string) =>
      unifiedDataService.searchAccommodations(query),
    getFilteredAccommodations: (filters: any) =>
      unifiedDataService.getFilteredAccommodations(filters),
  };
};

// Exportar tipos
export type { UnifiedAccommodation, UserProfile };
