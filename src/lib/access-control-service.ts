// Servicio de control de acceso para gestión de portería

export interface AccessRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  memberPhoto?: string;
  membershipType: string;
  accessTime: Date;
  location: string;
  companionsCount: number;
  detectionMethod: "qr" | "card" | "camera" | "manual";
  gateKeeperName: string;
  gateKeeperId: string;
  notes?: string;
  status: "active" | "completed";
}

export interface MemberDetectionResult {
  success: boolean;
  member?: {
    id: string;
    name: string;
    memberCode: string;
    photo?: string;
    membershipType: string;
    status: "active" | "inactive" | "suspended";
    lastAccess?: Date;
  };
  error?: string;
}

export interface CompanionEntry {
  recordId: string;
  companionsCount: number;
  notes?: string;
  timestamp: Date;
}

class AccessControlService {
  private static instance: AccessControlService;
  private accessRecords: AccessRecord[] = [];
  private detectionQueue: Map<string, any> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): AccessControlService {
    if (!AccessControlService.instance) {
      AccessControlService.instance = new AccessControlService();
    }
    return AccessControlService.instance;
  }

  // Inicializar datos de prueba
  private initializeMockData(): void {
    const mockRecords: AccessRecord[] = [
      {
        id: "1",
        memberId: "6",
        memberName: "María José González",
        memberCode: "MJ001",
        memberPhoto:
          "https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=150&h=150&fit=crop&crop=face",
        membershipType: "Premium",
        accessTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        location: "Entrada Principal",
        companionsCount: 2,
        detectionMethod: "qr",
        gateKeeperName: "Roberto Portillo",
        gateKeeperId: "11",
        status: "completed",
      },
      {
        id: "2",
        memberId: "7",
        memberName: "Carlos Rivera",
        memberCode: "CR002",
        memberPhoto:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        membershipType: "Básica",
        accessTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
        location: "Entrada Principal",
        companionsCount: 0,
        detectionMethod: "card",
        gateKeeperName: "Roberto Portillo",
        gateKeeperId: "11",
        status: "active",
      },
      {
        id: "3",
        memberId: "8",
        memberName: "Ana Martínez",
        memberCode: "AM003",
        memberPhoto:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        membershipType: "Premium",
        accessTime: new Date(Date.now() - 20 * 60 * 1000), // 20 minutos atrás
        location: "Entrada Principal",
        companionsCount: 1,
        detectionMethod: "camera",
        gateKeeperName: "Roberto Portillo",
        gateKeeperId: "11",
        status: "active",
      },
    ];

    this.accessRecords = mockRecords;
  }

  // Simular detección de miembro por QR
  public async detectMemberByQR(
    qrCode: string,
  ): Promise<MemberDetectionResult> {
    console.log("🔍 Detectando miembro por QR:", qrCode);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simular detección exitosa
    const mockMembers = [
      {
        id: "6",
        name: "María José González",
        memberCode: "MJ001",
        photo:
          "https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=150&h=150&fit=crop&crop=face",
        membershipType: "Premium",
        status: "active" as const,
        lastAccess: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "7",
        name: "Carlos Rivera",
        memberCode: "CR002",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        membershipType: "Básica",
        status: "active" as const,
        lastAccess: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    const member = mockMembers[Math.floor(Math.random() * mockMembers.length)];

    return {
      success: true,
      member,
    };
  }

  // Simular detección de miembro por tarjeta
  public async detectMemberByCard(
    cardId: string,
  ): Promise<MemberDetectionResult> {
    console.log("��� Detectando miembro por tarjeta:", cardId);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() > 0.1) {
      // 90% éxito
      return {
        success: true,
        member: {
          id: "8",
          name: "Ana Martínez",
          memberCode: "AM003",
          photo:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          membershipType: "Premium",
          status: "active",
          lastAccess: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
      };
    }

    return {
      success: false,
      error: "Tarjeta no reconocida o miembro inactivo",
    };
  }

  // Simular detección de miembro por cámara
  public async detectMemberByCamera(): Promise<MemberDetectionResult> {
    console.log("📷 Detectando miembro por reconocimiento facial...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (Math.random() > 0.2) {
      // 80% éxito
      return {
        success: true,
        member: {
          id: "9",
          name: "Juan Pérez",
          memberCode: "JP004",
          photo:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          membershipType: "Básica",
          status: "active",
          lastAccess: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      };
    }

    return {
      success: false,
      error: "No se pudo reconocer al miembro. Intente otro método.",
    };
  }

  // Registrar acceso de miembro
  public async registerAccess(
    memberId: string,
    memberName: string,
    memberCode: string,
    detectionMethod: AccessRecord["detectionMethod"],
    gateKeeperId: string,
    gateKeeperName: string,
    location: string = "Entrada Principal",
    memberPhoto?: string,
    membershipType: string = "Básica",
  ): Promise<string> {
    const recordId = this.generateId();

    const accessRecord: AccessRecord = {
      id: recordId,
      memberId,
      memberName,
      memberCode,
      memberPhoto,
      membershipType,
      accessTime: new Date(),
      location,
      companionsCount: 0, // Se actualizará después
      detectionMethod,
      gateKeeperName,
      gateKeeperId,
      status: "active",
    };

    this.accessRecords.unshift(accessRecord);

    console.log("✅ Acceso registrado:", {
      recordId,
      member: memberName,
      method: detectionMethod,
      time: accessRecord.accessTime,
    });

    // Simular notificación al anfitrión
    this.notifyHost(accessRecord);

    return recordId;
  }

  // Registrar acompañantes
  public async registerCompanions(
    recordId: string,
    companionsCount: number,
    notes?: string,
  ): Promise<boolean> {
    const record = this.accessRecords.find((r) => r.id === recordId);

    if (!record) {
      console.error("❌ Registro de acceso no encontrado:", recordId);
      return false;
    }

    record.companionsCount = companionsCount;
    record.notes = notes;
    record.status = "completed";

    console.log("✅ Acompañantes registrados:", {
      recordId,
      companions: companionsCount,
      notes,
    });

    // Actualizar notificación al anfitrión con info de acompañantes
    this.notifyHost(record);

    return true;
  }

  // Obtener historial de accesos
  public getAccessHistory(
    limit: number = 50,
    memberId?: string,
    date?: Date,
  ): AccessRecord[] {
    let filtered = [...this.accessRecords];

    if (memberId) {
      filtered = filtered.filter((record) => record.memberId === memberId);
    }

    if (date) {
      const targetDate = new Date(date);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.accessTime);
        return recordDate.toDateString() === targetDate.toDateString();
      });
    }

    return filtered
      .sort((a, b) => b.accessTime.getTime() - a.accessTime.getTime())
      .slice(0, limit);
  }

  // Obtener accesos activos (sin completar)
  public getActiveAccesses(): AccessRecord[] {
    return this.accessRecords
      .filter((record) => record.status === "active")
      .sort((a, b) => b.accessTime.getTime() - a.accessTime.getTime());
  }

  // Obtener estadísticas del día
  public getDailyStats(date: Date = new Date()): {
    totalAccesses: number;
    totalCompanions: number;
    activeAccesses: number;
    detectionMethods: Record<string, number>;
  } {
    const targetDate = new Date(date);
    const dayRecords = this.accessRecords.filter((record) => {
      const recordDate = new Date(record.accessTime);
      return recordDate.toDateString() === targetDate.toDateString();
    });

    const detectionMethods: Record<string, number> = {};
    let totalCompanions = 0;

    dayRecords.forEach((record) => {
      detectionMethods[record.detectionMethod] =
        (detectionMethods[record.detectionMethod] || 0) + 1;
      totalCompanions += record.companionsCount;
    });

    return {
      totalAccesses: dayRecords.length,
      totalCompanions,
      activeAccesses: dayRecords.filter((r) => r.status === "active").length,
      detectionMethods,
    };
  }

  // Notificar al anfitrión
  private notifyHost(record: AccessRecord): void {
    console.log("📢 Notificando al anfitrión:", {
      member: record.memberName,
      companions: record.companionsCount,
      time: record.accessTime,
      location: record.location,
    });

    // En una implementación real, aquí se enviaría la notificación al sistema del anfitrión
    // para preparar el cobro de acompañantes
  }

  // Generar ID único
  private generateId(): string {
    return `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Buscar miembro por código
  public async searchMemberByCode(
    memberCode: string,
  ): Promise<MemberDetectionResult> {
    console.log("🔍 Buscando miembro por código:", memberCode);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular búsqueda en base de datos
    const mockMembers = [
      {
        id: "6",
        name: "María José González",
        memberCode: "MJ001",
        photo:
          "https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=150&h=150&fit=crop&crop=face",
        membershipType: "Premium",
        status: "active" as const,
      },
      {
        id: "7",
        name: "Carlos Rivera",
        memberCode: "CR002",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        membershipType: "Básica",
        status: "active" as const,
      },
      {
        id: "8",
        name: "Ana Martínez",
        memberCode: "AM003",
        photo:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        membershipType: "Premium",
        status: "active" as const,
      },
    ];

    const member = mockMembers.find((m) =>
      m.memberCode.toLowerCase().includes(memberCode.toLowerCase()),
    );

    if (member) {
      return {
        success: true,
        member,
      };
    }

    return {
      success: false,
      error: "Miembro no encontrado",
    };
  }
}

// Export singleton instance
export const accessControlService = AccessControlService.getInstance();
