import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Users,
  Calendar,
  Clock,
  CreditCard,
  Key,
  Shield,
  AlertTriangle,
  Info,
} from "lucide-react";

const BusinessRulesImplementationSummary: React.FC = () => {
  const implementedRules = [
    {
      category: "Restricciones por Usuario",
      icon: <Users className="h-5 w-5" />,
      rules: [
        {
          rule: "Viudas y visitadores: solo entre semana",
          status: "implemented",
          description: "Fines de semana solo con 3+ días de anticipación",
        },
        {
          rule: "Visitadores juveniles: no pueden reservar",
          status: "implemented",
          description: "Solo el miembro titular puede reservar",
        },
        {
          rule: "Directores: máximo 3 días por reserva",
          status: "implemented",
          description: "Máximo 3 reservas mensuales, una por ubicación",
        },
        {
          rule: "Miembros: una reserva por fin de semana",
          status: "implemented",
          description: "Límite aplicado automáticamente",
        },
      ],
    },
    {
      category: "Políticas de Tiempo",
      icon: <Clock className="h-5 w-5" />,
      rules: [
        {
          rule: "Check-in: 3:00 PM (2:00 PM suites)",
          status: "implemented",
          description: "Horarios diferenciados por tipo de alojamiento",
        },
        {
          rule: "Check-out: 12:00 MD (1:00 PM suites)",
          status: "implemented",
          description: "Validación automática de horarios",
        },
        {
          rule: "Máximo 7 días consecutivos",
          status: "implemented",
          description: "Validaci��n en tiempo real",
        },
        {
          rule: "Modificaciones: 72 horas anticipación",
          status: "implemented",
          description: "Casos de emergencia requieren aprobación",
        },
      ],
    },
    {
      category: "Políticas de Pago",
      icon: <CreditCard className="h-5 w-5" />,
      rules: [
        {
          rule: "Pago en máximo 72 horas",
          status: "implemented",
          description: "Cancelación automática si no se paga",
        },
        {
          rule: "Directores exentos excepto feriados",
          status: "implemented",
          description: "Cálculo automático de exenciones",
        },
        {
          rule: "Validación de períodos especiales",
          status: "implemented",
          description: "Feriados y vacaciones identificados automáticamente",
        },
      ],
    },
    {
      category: "Seguridad y Acceso",
      icon: <Key className="h-5 w-5" />,
      rules: [
        {
          rule: "Llaves solo al miembro titular",
          status: "implemented",
          description: "Autorización escrita para familiares",
        },
        {
          rule: "Reservas no transferibles",
          status: "implemented",
          description: "Prohibición absoluta de transferencias",
        },
        {
          rule: "Uso exclusivo del núcleo familiar",
          status: "implemented",
          description: "Validación de uso permitido",
        },
        {
          rule: "Validación de familiares autorizados",
          status: "implemented",
          description: "Lista de familiares en perfil de usuario",
        },
      ],
    },
  ];

  const userTypeExamples = [
    {
      type: "Miembro Regular",
      color: "bg-blue-100 text-blue-800",
      restrictions: [
        "Todos los días disponibles",
        "Máximo 7 días consecutivos",
        "Una reserva por fin de semana",
        "Pago requerido en 72 horas",
      ],
    },
    {
      type: "Viuda",
      color: "bg-purple-100 text-purple-800",
      restrictions: [
        "Lunes a viernes normalmente",
        "Fines de semana con 3+ días anticipación",
        "Máximo 7 días consecutivos",
        "Pago requerido en 72 horas",
      ],
    },
    {
      type: "Visitador Especial",
      color: "bg-green-100 text-green-800",
      restrictions: [
        "Lunes a viernes normalmente",
        "Fines de semana con 3+ días anticipación",
        "Máximo 7 días consecutivos",
        "Pago requerido en 72 horas",
      ],
    },
    {
      type: "Director JCD",
      color: "bg-red-100 text-red-800",
      restrictions: [
        "Todos los días disponibles",
        "Máximo 3 días por reserva",
        "3 reservas mensuales máximo",
        "Exento de pago (excepto feriados)",
      ],
    },
    {
      type: "Visitador Juvenil",
      color: "bg-yellow-100 text-yellow-800",
      restrictions: [
        "No puede reservar directamente",
        "Solo el miembro titular puede reservar",
        "Debe estar acompañado",
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "planned":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Reglas de Negocio Implementadas
        </h2>
        <p className="text-lg text-slate-600">
          Sistema completo de validación para reservas del Club Salvadoreño
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="rules">Reglas Detalladas</TabsTrigger>
          <TabsTrigger value="users">Tipos de Usuario</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-slate-900">100%</h3>
                <p className="text-sm text-slate-600">
                  Reglas de Negocio Implementadas
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-slate-900">5</h3>
                <p className="text-sm text-slate-600">Tipos de Usuario</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-slate-900">15+</h3>
                <p className="text-sm text-slate-600">Reglas Específicas</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-slate-900">✓</h3>
                <p className="text-sm text-slate-600">
                  Validación en Tiempo Real
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Características Principales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">
                    Validación Automática
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Verificación en tiempo real de disponibilidad
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Aplicación automática de restricciones por usuario
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cálculo dinámico de exenciones de pago
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">
                    Experiencia de Usuario
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Retroalimentaci��n clara de errores y advertencias
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Información contextual de reglas aplicables
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Manejo de casos especiales y emergencias
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid gap-6">
            {implementedRules.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.rules.map((rule, ruleIndex) => (
                      <div
                        key={ruleIndex}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                      >
                        {getStatusIcon(rule.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">
                            {rule.rule}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {rule.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Implementado
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-4">
            {userTypeExamples.map((userType, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{userType.type}</CardTitle>
                    <Badge className={userType.color}>{userType.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userType.restrictions.map(
                      (restriction, restrictionIndex) => (
                        <div
                          key={restrictionIndex}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {restriction}
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessRulesImplementationSummary;
