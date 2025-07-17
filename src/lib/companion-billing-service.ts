// Servicio de facturación de acompañantes para anfitriones

export interface CompanionBillingRecord {
  id: string;
  accessRecordId: string;
  memberName: string;
  memberCode: string;
  membershipType: string;
  location: "El Sunzal" | "Corinto";
  companionsCount: number;
  accessTime: Date;
  gateKeeperName: string;
  status: "pending" | "processed" | "cancelled";
  billingItems: BillingItem[];
  totalAmount: number;
  notes?: string;
  processedAt?: Date;
  processedBy?: string;
}

export interface BillingItem {
  id: string;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
  location: string;
  category: string;
}

export interface PricingRule {
  location: "El Sunzal" | "Corinto";
  category: string;
  description: string;
  price: number;
  conditions?: string;
}

// Tarifas según la información proporcionada
const PRICING_RULES: PricingRule[] = [
  // El Sunzal
  {
    location: "El Sunzal",
    category: "INVITADO DIA FESTIVO TEMP ALTA",
    description: "COBRO INVITADO DIA FESTIVO TEMP ALTA",
    price: 20.0,
  },
  {
    location: "El Sunzal",
    category: "INVITADOS EVENTO",
    description: "INVITADOS EVENTO",
    price: 10.0,
  },
  {
    location: "El Sunzal",
    category: "INVITADO LUNES-SABADO TEMP BAJA",
    description: "INVITADO LUNES-SABADO TEMP BAJA",
    price: 10.0,
  },
  {
    location: "El Sunzal",
    category: "INVITADO DOMINGO TEMP BAJA",
    description: "INVITADO DOMINGO TEMP BAJA",
    price: 15.0,
  },
  {
    location: "El Sunzal",
    category: "INVITADO DIA FESTIVO TEMP BAJA",
    description: "INVITADO DIA FESTIVO TEMP BAJA",
    price: 20.0,
  },
  // Corinto
  {
    location: "Corinto",
    category: "CUOTA INVITADO",
    description: "CUOTA INVITADO",
    price: 10.0,
  },
  {
    location: "Corinto",
    category: "GF INVITADO SOCIO",
    description: "GREEN FREE (Uso de las canchas de golf)",
    price: 60.0,
  },
  {
    location: "Corinto",
    category: "INVITADOS EVENTO",
    description: "INVITADOS EVENTO",
    price: 10.0,
  },
];

class CompanionBillingService {
  private static instance: CompanionBillingService;
  private billingRecords: CompanionBillingRecord[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): CompanionBillingService {
    if (!CompanionBillingService.instance) {
      CompanionBillingService.instance = new CompanionBillingService();
    }
    return CompanionBillingService.instance;
  }

  // Inicializar datos de prueba
  private initializeMockData(): void {
    const mockRecords: CompanionBillingRecord[] = [
      {
        id: "bill_1",
        accessRecordId: "access_1",
        memberName: "María José González",
        memberCode: "MJ001",
        membershipType: "Contribuyente",
        location: "El Sunzal",
        companionsCount: 2,
        accessTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        gateKeeperName: "Roberto Portillo",
        status: "pending",
        billingItems: [
          {
            id: "item_1",
            description: "INVITADO LUNES-SABADO TEMP BAJA",
            unitPrice: 10.0,
            quantity: 2,
            total: 20.0,
            location: "El Sunzal",
            category: "INVITADO LUNES-SABADO TEMP BAJA",
          },
        ],
        totalAmount: 20.0,
        notes: "Acceso registrado automáticamente desde portería",
      },
      {
        id: "bill_2",
        accessRecordId: "access_2",
        memberName: "Carlos Rivera",
        memberCode: "CR002",
        membershipType: "Fundador",
        location: "Corinto",
        companionsCount: 1,
        accessTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        gateKeeperName: "Roberto Portillo",
        status: "pending",
        billingItems: [
          {
            id: "item_2",
            description: "CUOTA INVITADO",
            unitPrice: 10.0,
            quantity: 1,
            total: 10.0,
            location: "Corinto",
            category: "CUOTA INVITADO",
          },
        ],
        totalAmount: 10.0,
      },
    ];

    this.billingRecords = mockRecords;
  }

  // Crear registro de facturación desde acceso de portería
  public async createBillingFromAccess(
    accessRecordId: string,
    memberName: string,
    memberCode: string,
    membershipType: string,
    location: "El Sunzal" | "Corinto",
    companionsCount: number,
    accessTime: Date,
    gateKeeperName: string,
    notes?: string,
  ): Promise<CompanionBillingRecord> {
    const billingItems = this.calculateBillingItems(location, companionsCount);
    const totalAmount = billingItems.reduce((sum, item) => sum + item.total, 0);

    const billingRecord: CompanionBillingRecord = {
      id: this.generateId(),
      accessRecordId,
      memberName,
      memberCode,
      membershipType,
      location,
      companionsCount,
      accessTime,
      gateKeeperName,
      status: "pending",
      billingItems,
      totalAmount,
      notes,
    };

    this.billingRecords.unshift(billingRecord);

    console.log("✅ Billing record created for host:", {
      id: billingRecord.id,
      member: memberName,
      companions: companionsCount,
      amount: totalAmount,
      location,
    });

    return billingRecord;
  }

  // Calcular items de facturación según ubicación y número de acompañantes
  private calculateBillingItems(
    location: "El Sunzal" | "Corinto",
    companionsCount: number,
  ): BillingItem[] {
    if (companionsCount === 0) return [];

    // Obtener regla de precio según ubicación y día
    const pricingRule = this.getPricingRule(location);

    return [
      {
        id: this.generateId(),
        description: pricingRule.description,
        unitPrice: pricingRule.price,
        quantity: companionsCount,
        total: pricingRule.price * companionsCount,
        location,
        category: pricingRule.category,
      },
    ];
  }

  // Obtener regla de precios según ubicación y contexto actual
  private getPricingRule(location: "El Sunzal" | "Corinto"): PricingRule {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = domingo, 6 = sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    if (location === "El Sunzal") {
      // Por defecto usar tarifa de lunes-sábado temp baja
      if (isSunday) {
        return PRICING_RULES.find(
          (r) => r.category === "INVITADO DOMINGO TEMP BAJA",
        )!;
      }
      return PRICING_RULES.find(
        (r) => r.category === "INVITADO LUNES-SABADO TEMP BAJA",
      )!;
    } else {
      // Corinto - usar cuota estándar de invitado
      return PRICING_RULES.find((r) => r.category === "CUOTA INVITADO")!;
    }
  }

  // Obtener registros pendientes para anfitrión
  public getPendingBillingRecords(): CompanionBillingRecord[] {
    return this.billingRecords
      .filter((record) => record.status === "pending")
      .sort((a, b) => b.accessTime.getTime() - a.accessTime.getTime());
  }

  // Obtener todos los registros de facturación
  public getAllBillingRecords(limit: number = 50): CompanionBillingRecord[] {
    return this.billingRecords
      .sort((a, b) => b.accessTime.getTime() - a.accessTime.getTime())
      .slice(0, limit);
  }

  // Procesar cobro
  public async processBilling(
    billingId: string,
    processedBy: string,
    notes?: string,
  ): Promise<boolean> {
    const record = this.billingRecords.find((r) => r.id === billingId);

    if (!record) {
      throw new Error("Registro de facturación no encontrado");
    }

    record.status = "processed";
    record.processedAt = new Date();
    record.processedBy = processedBy;
    if (notes) {
      record.notes = (record.notes || "") + "\n" + notes;
    }

    console.log("✅ Billing processed:", {
      id: billingId,
      amount: record.totalAmount,
      processedBy,
    });

    return true;
  }

  // Cancelar cobro
  public async cancelBilling(
    billingId: string,
    cancelledBy: string,
    reason: string,
  ): Promise<boolean> {
    const record = this.billingRecords.find((r) => r.id === billingId);

    if (!record) {
      throw new Error("Registro de facturación no encontrado");
    }

    record.status = "cancelled";
    record.processedAt = new Date();
    record.processedBy = cancelledBy;
    record.notes = (record.notes || "") + `\nCancelado: ${reason}`;

    console.log("❌ Billing cancelled:", {
      id: billingId,
      reason,
      cancelledBy,
    });

    return true;
  }

  // Obtener reglas de precios disponibles
  public getPricingRules(location?: "El Sunzal" | "Corinto"): PricingRule[] {
    if (location) {
      return PRICING_RULES.filter((rule) => rule.location === location);
    }
    return PRICING_RULES;
  }

  // Generar ID único
  private generateId(): string {
    return `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obtener estadísticas de facturación
  public getBillingStats(): {
    pendingCount: number;
    pendingAmount: number;
    processedToday: number;
    totalToday: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pending = this.billingRecords.filter((r) => r.status === "pending");
    const todayRecords = this.billingRecords.filter(
      (r) => r.accessTime >= today && r.accessTime < tomorrow,
    );

    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, r) => sum + r.totalAmount, 0),
      processedToday: todayRecords.filter((r) => r.status === "processed")
        .length,
      totalToday: todayRecords.reduce((sum, r) => sum + r.totalAmount, 0),
    };
  }
}

// Export singleton instance
export const companionBillingService = CompanionBillingService.getInstance();
