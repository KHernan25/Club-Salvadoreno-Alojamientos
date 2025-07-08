import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { ReviewList } from "@/components/ReviewList";
import { ReviewForm } from "@/components/ReviewForm";
import { StarRatingDisplay } from "@/components/ui/star-rating";
import { HostResponseForm } from "@/components/HostResponseForm";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  MessageSquare,
  Users,
  Building2,
  MapPin,
  Award,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - in real app this would come from API
const mockAccommodation = {
  id: "1A",
  name: "Apartamento 1A",
  type: "apartamento",
  location: "el-sunzal",
  images: ["/DSC_5214.jpg", "/DSC_5363.jpg", "/DSC_5212.jpg"],
  description:
    "Apartamento amplio con vista al océano, perfecto para parejas o familias pequeñas.",
  fullDescription:
    "Este hermoso apartamento cuenta con una vista espectacular al océano Pacífico. Equipado con todas las comodidades modernas, es el lugar perfecto para relajarse y disfrutar de las mejores olas de El Salvador.",
  capacity: 4,
  bedrooms: 2,
  bathrooms: 1,
  features: [
    "Vista al mar",
    "Wi-Fi gratis",
    "Aire acondicionado",
    "Cocina equipada",
    "TV por cable",
    "Estacionamiento",
  ],
  pricing: {
    weekday: 110,
    weekend: 230,
    daily: 140,
  },
};

const mockReviews = [
  {
    id: "rev-001",
    userName: "Carlos Rivera",
    rating: 5,
    title: "Excelente experiencia con vista al mar",
    comment:
      "El apartamento superó nuestras expectativas. La vista al mar es espectacular y las instalaciones están en perfectas condiciones. El personal fue muy atento y la ubicación es ideal para disfrutar del surf.",
    pros: [
      "Vista espectacular",
      "Instalaciones impecables",
      "Personal atento",
      "Ubicación perfecta",
    ],
    cons: ["El wifi podría ser más rápido"],
    wouldRecommend: true,
    isVerifiedStay: true,
    stayDate: "2024-06-30",
    createdAt: new Date("2024-07-03T10:00:00Z"),
    helpfulVotes: 12,
    hostResponse: {
      response:
        "¡Muchas gracias Carlos por tu comentario! Nos alegra saber que disfrutaste tu estadía. Hemos mejorado la conexión WiFi para futuras visitas. ¡Esperamos verte de nuevo pronto!",
      respondedAt: new Date("2024-07-04T09:30:00Z"),
      respondedBy: "Administración Club Salvadoreño",
    },
  },
  {
    id: "rev-002",
    userName: "Ana Martinez",
    rating: 4,
    title: "Muy buena ubicación y comodidades",
    comment:
      "El apartamento está muy bien ubicado y las comodidades son excelentes. La vista es hermosa y el lugar está muy limpio. Solo faltaba un poco más de espacio en el estacionamiento.",
    pros: ["Excelente ubicación", "Muy limpio", "Vista hermosa"],
    cons: ["Estacionamiento pequeño"],
    wouldRecommend: true,
    isVerifiedStay: true,
    stayDate: "2024-07-05",
    createdAt: new Date("2024-07-08T14:30:00Z"),
    helpfulVotes: 8,
  },
];

const mockStats = {
  totalReviews: 15,
  averageRating: 4.6,
  ratingDistribution: {
    5: 8,
    4: 5,
    3: 2,
    2: 0,
    1: 0,
  },
  recommendationRate: 93,
};

const AccommodationWithReviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState(mockReviews);
  const [stats, setStats] = useState(mockStats);

  // Check if user can write a review (has stayed and hasn't reviewed)
  const [canWriteReview, setCanWriteReview] = useState(true);
  const [userRole, setUserRole] = useState("miembro"); // Get from auth context

  const accommodation = mockAccommodation; // In real app, fetch by id

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % accommodation.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? accommodation.images.length - 1 : prev - 1,
    );
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      // In real app, call API to create review
      console.log("Submitting review:", reviewData);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update reviews list (in real app, refetch from API)
      const newReview = {
        id: `rev-${Date.now()}`,
        userName: "Usuario Actual",
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        pros: reviewData.pros || [],
        cons: reviewData.cons || [],
        wouldRecommend: reviewData.wouldRecommend,
        isVerifiedStay: true,
        stayDate: "2024-07-15",
        createdAt: new Date(),
        helpfulVotes: 0,
      };

      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
      setCanWriteReview(false);

      toast.success("Reseña enviada exitosamente");
    } catch (error) {
      toast.error("Error al enviar la reseña");
      throw error;
    }
  };

  const handleHostResponse = async (reviewId: string, response: string) => {
    try {
      // In real app, call API to add host response
      console.log("Adding host response:", { reviewId, response });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update review with host response
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                hostResponse: {
                  response,
                  respondedAt: new Date(),
                  respondedBy: "Administración Club Salvadoreño",
                },
              }
            : review,
        ),
      );

      toast.success("Respuesta enviada exitosamente");
    } catch (error) {
      toast.error("Error al enviar la respuesta");
      throw error;
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      // In real app, call API to vote
      console.log("Voting helpful for review:", reviewId);

      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? { ...review, helpfulVotes: review.helpfulVotes + 1 }
            : review,
        ),
      );

      toast.success("Voto registrado");
    } catch (error) {
      toast.error("Error al registrar voto");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => navigate("/accommodations")}
                className="hover:text-blue-600"
              >
                Alojamientos
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => navigate("/el-sunzal/apartamentos")}
                className="hover:text-blue-600"
              >
                Apartamentos El Sunzal
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{accommodation.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={accommodation.images[currentImageIndex]}
                  alt={accommodation.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {accommodation.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentImageIndex === index ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Accommodation Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {accommodation.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>El Sunzal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>Apartamento</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Hasta {accommodation.capacity} huéspedes</span>
                    </div>
                  </div>
                </div>
                <StarRatingDisplay
                  rating={stats.averageRating}
                  totalReviews={stats.totalReviews}
                  size="lg"
                />
              </div>

              <p className="text-gray-700 text-lg">
                {accommodation.description}
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Información</TabsTrigger>
                <TabsTrigger value="amenities">Servicios</TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Reseñas ({stats.totalReviews})
                </TabsTrigger>
                <TabsTrigger value="location">Ubicación</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Descripción completa
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {accommodation.fullDescription}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {accommodation.bedrooms}
                        </div>
                        <div className="text-sm text-gray-600">
                          Habitaciones
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {accommodation.bathrooms}
                        </div>
                        <div className="text-sm text-gray-600">Baños</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {accommodation.capacity}
                        </div>
                        <div className="text-sm text-gray-600">Huéspedes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Servicios incluidos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {accommodation.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Review Actions */}
                  {canWriteReview && !showReviewForm && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            ¿Has estado aquí?
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Comparte tu experiencia con otros huéspedes
                          </p>
                          <Button onClick={() => setShowReviewForm(true)}>
                            <Star className="h-4 w-4 mr-2" />
                            Escribir reseña
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Review Form */}
                  {showReviewForm && (
                    <ReviewForm
                      accommodationId={accommodation.id}
                      reservationId="mock-reservation-id"
                      accommodationName={accommodation.name}
                      onSubmit={handleReviewSubmit}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  )}

                  {/* Reviews List */}
                  <ReviewList
                    reviews={reviews}
                    stats={stats}
                    onHelpfulVote={handleHelpfulVote}
                    onFilterChange={(filters) => {
                      console.log("Filter changed:", filters);
                      // In real app, filter reviews based on filters
                    }}
                  />

                  {/* Host Response Forms for Admin */}
                  {userRole === "admin" &&
                    reviews
                      .filter((review) => !review.hostResponse)
                      .map((review) => (
                        <div key={`response-${review.id}`} className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Responder a {review.userName}:
                          </h4>
                          <HostResponseForm
                            review={review}
                            onSubmit={handleHostResponse}
                            asDialog={true}
                            trigger={
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Responder
                              </Button>
                            }
                          />
                        </div>
                      ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>El Sunzal, La Libertad</p>
                        <p className="text-sm">Mapa interactivo próximamente</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <Card className="sticky top-24 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Reservar ahora</span>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Award className="h-3 w-3" />
                    Huésped favorito
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Precios desde ${accommodation.pricing.weekday} por noche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Price breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Día de semana</span>
                      <span>${accommodation.pricing.weekday}/noche</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fin de semana</span>
                      <span>${accommodation.pricing.weekend}/noche</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Asueto</span>
                      <span>${accommodation.pricing.daily}/noche</span>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    className="w-full"
                    onClick={() => navigate("/reservas")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Verificar disponibilidad
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Cancelación gratuita hasta 24h antes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Calificación promedio
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {stats.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total de reseñas
                    </span>
                    <span className="font-semibold">{stats.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Recomendación</span>
                    <span className="font-semibold text-green-600">
                      {stats.recommendationRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationWithReviews;
