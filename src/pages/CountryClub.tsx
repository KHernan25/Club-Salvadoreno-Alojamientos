import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  User,
  Globe,
  ChevronDown,
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Star,
  ChefHat,
  Utensils,
  Coffee,
  Wine,
  Camera,
  PlayCircle,
} from "lucide-react";

const CountryClub = () => {
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState("grill");

  // Restaurantes disponibles
  const restaurants = [
    {
      id: "grill",
      name: "Country Grill",
      type: "Restaurante Principal",
      description: "Carnes premium y especialidades internacionales",
      image: "/placeholder.svg",
      hours: "12:00 PM - 10:00 PM",
      phone: "+503 2345-6789",
      rating: 4.8,
      features: ["Terraza", "Aire Acondicionado", "Eventos Privados"],
    },
    {
      id: "cafe",
      name: "Club Café",
      type: "Cafetería",
      description: "Café gourmet, pasteles y snacks ligeros",
      image: "/placeholder.svg",
      hours: "7:00 AM - 6:00 PM",
      phone: "+503 2345-6790",
      rating: 4.6,
      features: ["WiFi Gratis", "Terraza", "Desayunos"],
    },
    {
      id: "bar",
      name: "Club Lounge",
      type: "Bar & Lounge",
      description: "Cocteles premium y ambiente relajado",
      image: "/placeholder.svg",
      hours: "4:00 PM - 12:00 AM",
      phone: "+503 2345-6791",
      rating: 4.7,
      features: ["Música en Vivo", "Terraza", "Happy Hour"],
    },
  ];

  // Menú por categorías
  const menuCategories = [
    {
      name: "Entradas",
      items: [
        {
          name: "Ceviche de Camarón",
          price: "$12.50",
          description:
            "Fresco camarón marinado en limón con cilantro y cebolla",
        },
        {
          name: "Alitas BBQ",
          price: "$9.75",
          description: "Alitas de pollo con salsa barbacoa casera",
        },
        {
          name: "Nachos Supreme",
          price: "$11.25",
          description: "Tortillas con queso, guacamole y jalapeños",
        },
        {
          name: "Sopa de Tortilla",
          price: "$7.50",
          description: "Sopa tradicional con pollo y vegetales",
        },
      ],
    },
    {
      name: "Platos Principales",
      items: [
        {
          name: "Filete Country",
          price: "$24.99",
          description: "Filete de res premium con papas y vegetales",
        },
        {
          name: "Salmón a la Parrilla",
          price: "$19.50",
          description: "Salmón fresco con salsa de mango",
        },
        {
          name: "Pollo Ranchero",
          price: "$16.75",
          description: "Pollo asado con especias salvadoreñas",
        },
        {
          name: "Pasta Alfredo",
          price: "$14.25",
          description: "Pasta fresca con salsa alfredo y pollo",
        },
      ],
    },
    {
      name: "Postres",
      items: [
        {
          name: "Tres Leches",
          price: "$6.50",
          description: "Pastel tradicional con tres tipos de leche",
        },
        {
          name: "Flan de Coco",
          price: "$5.75",
          description: "Flan cremoso con sabor a coco",
        },
        {
          name: "Brownie Supreme",
          price: "$7.25",
          description: "Brownie con helado y salsa de chocolate",
        },
      ],
    },
    {
      name: "Bebidas",
      items: [
        {
          name: "Café Americano",
          price: "$3.50",
          description: "Café recién tostado",
        },
        {
          name: "Limonada Natural",
          price: "$4.25",
          description: "Limonada fresca con menta",
        },
        {
          name: "Smoothie Tropical",
          price: "$6.50",
          description: "Mango, piña y maracuyá",
        },
        {
          name: "Agua Embotellada",
          price: "$2.00",
          description: "Agua purificada",
        },
      ],
    },
  ];

  // Puntos del recorrido virtual
  const tourSpots = [
    {
      id: 1,
      name: "Lobby Principal",
      description: "Área de recepción con diseño elegante y cómodo",
      image: "/placeholder.svg",
      type: "360°",
    },
    {
      id: 2,
      name: "Country Grill",
      description: "Restaurante principal con terraza y vista panorámica",
      image: "/placeholder.svg",
      type: "360°",
    },
    {
      id: 3,
      name: "Piscina y Área Social",
      description: "Zona de relajación con piscina y cabañas",
      image: "/placeholder.svg",
      type: "360°",
    },
    {
      id: 4,
      name: "Cancha de Tenis",
      description: "Cancha profesional para torneos y práctica",
      image: "/placeholder.svg",
      type: "Video",
    },
    {
      id: 5,
      name: "Salón de Eventos",
      description: "Espacio para celebraciones y eventos corporativos",
      image: "/placeholder.svg",
      type: "360°",
    },
    {
      id: 6,
      name: "Jardines",
      description: "Áreas verdes cuidadosamente diseñadas",
      image: "/placeholder.svg",
      type: "Video",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  Country Club
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Button variant="ghost" className="gap-2">
                <Globe className="h-4 w-4" />
                ES
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/perfil")}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Mi Perfil
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-b from-teal-600 to-teal-700 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(13, 148, 136, 0.8), rgba(13, 148, 136, 0.8)), url('/placeholder.svg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Country Club</h1>
            <p className="text-xl mb-6 leading-relaxed">
              Un espacio exclusivo en la ciudad para disfrutar deportes,
              gastronomía y entretenimiento. Donde las familias se reúnen para
              disfrutar de excelencia.
            </p>
            <div className="flex items-center gap-6 text-teal-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>San Salvador, El Salvador</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>+503 2345-6789</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="restaurants" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="restaurants" className="gap-2">
                <Utensils className="h-4 w-4" />
                Restaurantes
              </TabsTrigger>
              <TabsTrigger value="menu" className="gap-2">
                <ChefHat className="h-4 w-4" />
                Menú
              </TabsTrigger>
              <TabsTrigger value="tour" className="gap-2">
                <Camera className="h-4 w-4" />
                Recorrido Virtual
              </TabsTrigger>
            </TabsList>

            {/* Restaurantes Tab */}
            <TabsContent value="restaurants" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Nuestros Restaurantes
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Disfruta de una experiencia gastronómica única en nuestros
                  espacios diseñados para tu comodidad.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedRestaurant(restaurant.id)}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-teal-600">
                        {restaurant.type}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">
                          {restaurant.name}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        {restaurant.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{restaurant.hours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{restaurant.phone}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {restaurant.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Menú Tab */}
            <TabsContent value="menu" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Nuestro Menú
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Platos elaborados con ingredientes frescos y técnicas
                  culinarias excepcionales.
                </p>
              </div>

              <div className="grid gap-8">
                {menuCategories.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <ChefHat className="h-6 w-6 text-teal-600" />
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 lg:grid-cols-2">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex justify-between items-start p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {item.description}
                              </p>
                            </div>
                            <span className="font-bold text-teal-600 text-lg ml-4">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button className="bg-teal-600 hover:bg-teal-700" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Hacer Reservación
                </Button>
              </div>
            </TabsContent>

            {/* Recorrido Virtual Tab */}
            <TabsContent value="tour" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Recorrido Virtual
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Explora nuestras instalaciones desde la comodidad de tu hogar
                  con nuestro recorrido virtual 360°.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {tourSpots.map((spot) => (
                  <Card
                    key={spot.id}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={spot.image}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        {spot.type === "360°" ? (
                          <Camera className="h-12 w-12 text-white" />
                        ) : (
                          <PlayCircle className="h-12 w-12 text-white" />
                        )}
                      </div>
                      <Badge className="absolute top-4 right-4 bg-teal-600">
                        {spot.type}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{spot.name}</CardTitle>
                      <CardDescription>{spot.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button className="bg-teal-600 hover:bg-teal-700" size="lg">
                  <Camera className="h-4 w-4 mr-2" />
                  Comenzar Recorrido Completo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Visítanos
              </h3>
              <p className="text-slate-600 mb-6">
                Te esperamos en el Country Club para disfrutar de una
                experiencia única. Contáctanos para más información o
                reservaciones.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <span>Avenida Principal, San Salvador, El Salvador</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-600" />
                  <span>+503 2345-6789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <span>Lunes a Domingo: 7:00 AM - 12:00 AM</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button className="bg-teal-600 hover:bg-teal-700" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Contactar Ahora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-teal-900 font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-semibold">Country Club</span>
            </div>
            <p className="text-teal-100">
              © 2025 Country Club - Club Salvadoreño. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CountryClub;
