import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import { apiGetAccommodations, type Accommodation } from "@/lib/api-service";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  ArrowRight,
  Home,
  Building,
  Crown,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
  MapPin,
  Mountain,
  Waves,
} from "lucide-react";

const Accommodations = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("el-sunzal");
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar alojamientos de la API
  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGetAccommodations();
        setAccommodations(data);
      } catch (err) {
        console.error("Error loading accommodations:", err);
        setError("Error al cargar los alojamientos");
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  // Funciones helper para procesar datos de la API
  const getAccommodationsByLocation = (location: string) => {
    return accommodations.filter((acc) => acc.location === location);
  };

  const getAccommodationsByType = (location: string, type: string) => {
    return accommodations.filter(
      (acc) => acc.location === location && acc.type === type,
    );
  };

  const mapAccommodationToDisplay = (acc: Accommodation) => {
    return {
      id: acc.id,
      name: acc.name,
      category: acc.type,
      image: acc.images?.[0] || "/placeholder.svg",
      description: acc.description,
      features:
        acc.amenities?.map((amenity) => ({
          icon: Wifi, // Usamos un icono por defecto
          text: amenity,
        })) || [],
      pricing: {
        weekday: acc.pricing?.weekday || 0,
        weekend: acc.pricing?.weekend || 0,
        daily: acc.pricing?.holiday || 0,
      },
      capacity: acc.capacity,
      view: acc.view,
      available: acc.available,
    };
  };

  const locations = [
    {
      id: "corinto",
      title: "CORINTO",
      subtitle: "Tranquilidad junto al lago",
      description:
        "Disfruta de la serenidad del lago de Coatepeque en nuestras casas familiares. Perfectas para descansar en un ambiente natural y relajante.",
      image: "/DSC_5451.jpg",
      icon: Mountain,
      accommodationTypes: ["Casas"],
      color: "green",
    },
    {
      id: "el-sunzal",
      title: "EL SUNZAL",
      subtitle: "Aventura en la costa",
      description:
        "Vive la experiencia completa del océano Pacífico con nuestras casas, apartamentos y suites. El destino perfecto para surf, descanso y aventura.",
      image: "/DSC_5408.jpg",
      icon: Waves,
      accommodationTypes: ["Casas", "Apartamentos", "Suites"],
      color: "blue",
    },
  ];

  // Los datos de alojamientos ahora se cargan desde la API

  const getAccommodationsByLocationFromAPI = () => {
    const locationAccommodations =
      getAccommodationsByLocation(selectedLocation);

    if (selectedLocation === "corinto") {
      const casas = getAccommodationsByType(selectedLocation, "casa");
      return {
        location: "Corinto",
        types: [
          {
            id: "corinto-casas",
            title: "Casas en Corinto",
            description: "Amplias casas familiares junto al lago de Coatepeque",
            accommodations: casas.map(mapAccommodationToDisplay),
          },
        ],
      };
    } else {
      const casas = getAccommodationsByType(selectedLocation, "casa");
      const apartamentos = getAccommodationsByType(
        selectedLocation,
        "apartamento",
      );
      const suites = getAccommodationsByType(selectedLocation, "suite");

      const types = [];

      if (casas.length > 0) {
        types.push({
          id: "sunzal-casas",
          title: "Casas en El Sunzal",
          description: "Casas frente a la playa con acceso directo al océano",
          accommodations: casas.map(mapAccommodationToDisplay),
        });
      }

      if (apartamentos.length > 0) {
        types.push({
          id: "sunzal-apartamentos",
          title: "Apartamentos en El Sunzal",
          description: "Modernos apartamentos con vista al mar",
          accommodations: apartamentos.map(mapAccommodationToDisplay),
        });
      }

      if (suites.length > 0) {
        types.push({
          id: "sunzal-suites",
          title: "Suites en El Sunzal",
          description: "Suites de lujo con servicios premium",
          accommodations: suites.map(mapAccommodationToDisplay),
        });
      }

      return {
        location: "El Sunzal",
        types,
      };
    }
  };

  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/DSC_5408.jpg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">NUESTROS ALOJAMIENTOS</h1>
            <p className="text-xl">
              Elige tu destino favorito: Corinto para tranquilidad junto al lago
              o El Sunzal para aventuras en la costa.
            </p>
            <p className="text-lg mt-2 text-blue-100">
              Cada ubicación ofrece experiencias únicas.
            </p>
          </div>
        </div>
      </section>

      {/* Estados de carga y error */}
      {loading && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-slate-600">
              Cargando alojamientos...
            </p>
          </div>
        </section>
      )}

      {error && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Selección de Ubicaciones */}
      {!loading && !error && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Elige tu Destino
              </h2>
              <p className="text-lg text-slate-600">
                Selecciona la ubicación que prefieras para explorar nuestras
                opciones de alojamiento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
              {locations.map((location) => {
                const IconComponent = location.icon;
                return (
                  <Card
                    key={location.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedLocation === location.id
                        ? `ring-2 ring-${location.color}-500 shadow-lg transform scale-105`
                        : ""
                    }`}
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <img
                        src={location.image}
                        alt={location.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-4 right-4 bg-${location.color}-600 text-white p-3 rounded-full`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div
                        className={`absolute bottom-4 left-4 bg-${location.color}-600 text-white px-4 py-2 rounded`}
                      >
                        <span className="font-bold text-lg">
                          {location.title}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {location.subtitle}
                      </h3>
                      <p className="text-slate-700 mb-4 leading-relaxed">
                        {location.description}
                      </p>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-600 mb-2">
                          Tipos de alojamiento disponibles:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {location.accommodationTypes.map((type, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        className={`w-full bg-${location.color}-600 hover:bg-${location.color}-700`}
                        size="sm"
                      >
                        Explorar {location.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Submenús por Tipo de Alojamiento */}
      {!loading && !error && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {(() => {
              const locationData = getAccommodationsByLocationFromAPI();
              return (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      Alojamientos en {locationData.location}
                    </h2>
                    <p className="text-lg text-slate-600">
                      Explora nuestras opciones de hospedaje en esta ubicación
                    </p>
                  </div>

                  {locationData.types.map((type) => (
                    <div key={type.id} className="mb-16">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            {type.title}
                          </h3>
                          <p className="text-slate-600">{type.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (type.id.includes("casas")) {
                              navigate(
                                selectedLocation === "corinto"
                                  ? "/corinto/casas"
                                  : "/el-sunzal/casas",
                              );
                            } else if (type.id.includes("apartamentos")) {
                              navigate("/el-sunzal/apartamentos");
                            } else if (type.id.includes("suites")) {
                              navigate("/el-sunzal/suites");
                            }
                          }}
                        >
                          Ver Todas
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {type.accommodations
                          .slice(0, 3)
                          .map((accommodation) => (
                            <Card
                              key={accommodation.id}
                              className="group hover:shadow-xl transition-all duration-300"
                            >
                              <div className="relative h-64 overflow-hidden rounded-t-lg">
                                <img
                                  src={accommodation.image}
                                  alt={accommodation.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4 bg-blue-900 text-white px-3 py-1 rounded">
                                  <span className="font-semibold">
                                    {accommodation.name}
                                  </span>
                                </div>
                              </div>

                              <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                  {accommodation.name}
                                </h3>
                                <p className="text-slate-600 mb-4 text-sm">
                                  {accommodation.description}
                                </p>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                  {accommodation.features
                                    .slice(0, 6)
                                    .map((feature, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 text-xs text-slate-600"
                                      >
                                        <feature.icon className="h-3 w-3" />
                                        <span>{feature.text}</span>
                                      </div>
                                    ))}
                                </div>

                                {/* Pricing */}
                                <div className="border-t border-slate-200 pt-4 mb-4">
                                  <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                      <div className="text-xs text-slate-500">
                                        Día de Semana
                                      </div>
                                      <div className="text-sm font-semibold">
                                        ${accommodation.pricing.weekday}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-slate-500">
                                        Fin de Semana
                                      </div>
                                      <div className="text-sm font-semibold">
                                        ${accommodation.pricing.weekend}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-slate-500">
                                        Asueto (Día)
                                      </div>
                                      <div className="text-sm font-semibold">
                                        ${accommodation.pricing.daily}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    className="flex-1 bg-blue-900 hover:bg-blue-800"
                                    size="sm"
                                    onClick={() => {
                                      if (accommodation.category === "casas") {
                                        navigate(`/casa/${accommodation.id}`);
                                      } else if (
                                        accommodation.category === "suites"
                                      ) {
                                        navigate(`/suite/${accommodation.id}`);
                                      } else {
                                        navigate(
                                          `/apartamento/${accommodation.id}`,
                                        );
                                      }
                                    }}
                                  >
                                    Ver Detalles
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate("/reservas")}
                                  >
                                    Reservar
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Contáctenos
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            ¿Necesitas más información? Estamos aquí para ayudarte
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              Información
            </Button>
            <Button className="bg-blue-900 hover:bg-blue-800 gap-2">
              <ArrowRight className="h-4 w-4" />
              Reservar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-semibold">Club Salvadoreño</span>
            </div>
            <p className="text-blue-100">
              © 2025 Club Salvadoreño. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Accommodations;
