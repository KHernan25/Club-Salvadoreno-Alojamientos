import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingDisplay } from "@/components/ui/star-rating";
import { QuickHostResponse } from "@/components/HostResponseForm";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Star,
  Users,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  accommodationId: string;
  accommodationName: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  status: "pending" | "approved" | "rejected" | "flagged";
  moderationReason?: string;
  isVerifiedStay: boolean;
  stayDate: string;
  createdAt: Date;
  updatedAt: Date;
  helpfulVotes: number;
  hostResponse?: {
    response: string;
    respondedAt: Date;
    respondedBy: string;
  };
}

// Mock data
const mockReviews: Review[] = [
  {
    id: "rev-001",
    userId: "7",
    userName: "Carlos Rivera",
    userEmail: "carlos.rivera@email.com",
    accommodationId: "1A",
    accommodationName: "Apartamento 1A",
    rating: 5,
    title: "Excelente experiencia con vista al mar",
    comment:
      "El apartamento superó nuestras expectativas. La vista al mar es espectacular y las instalaciones están en perfectas condiciones.",
    pros: ["Vista espectacular", "Instalaciones impecables"],
    cons: ["WiFi lento"],
    wouldRecommend: true,
    status: "approved",
    isVerifiedStay: true,
    stayDate: "2024-06-30",
    createdAt: new Date("2024-07-03T10:00:00Z"),
    updatedAt: new Date("2024-07-03T10:00:00Z"),
    helpfulVotes: 12,
  },
  {
    id: "rev-002",
    userId: "8",
    userName: "Ana Martinez",
    userEmail: "ana.martinez@email.com",
    accommodationId: "corinto-casa-1",
    accommodationName: "Casa del Lago",
    rating: 2,
    title: "Experiencia decepcionante",
    comment:
      "El lugar no estaba limpio y el servicio fue terrible. No recomiendo para nada este lugar. Es una porquería total.",
    pros: [],
    cons: ["Sucio", "Mal servicio", "Sobreprecio"],
    wouldRecommend: false,
    status: "pending",
    moderationReason: "Contiene lenguaje inapropiado",
    isVerifiedStay: true,
    stayDate: "2024-07-05",
    createdAt: new Date("2024-07-08T14:30:00Z"),
    updatedAt: new Date("2024-07-08T14:30:00Z"),
    helpfulVotes: 2,
  },
  {
    id: "rev-003",
    userId: "10",
    userName: "Diego Morales",
    userEmail: "diego.morales@email.com",
    accommodationId: "suite1",
    accommodationName: "Suite Ejecutiva",
    rating: 5,
    title: "Contacto para promociones especiales",
    comment:
      "Excelente lugar! Para descuentos especiales contactar al WhatsApp +503 7123-4567 o al email promociones@ejemplo.com",
    pros: ["Buena ubicación"],
    cons: [],
    wouldRecommend: true,
    status: "flagged",
    moderationReason:
      "Posible contenido de spam - contiene información de contacto",
    isVerifiedStay: true,
    stayDate: "2024-07-10",
    createdAt: new Date("2024-07-13T09:15:00Z"),
    updatedAt: new Date("2024-07-13T09:15:00Z"),
    helpfulVotes: 0,
  },
];

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [accommodationFilter, setAccommodationFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationReason, setModerationReason] = useState("");

  // Filter reviews based on current filters
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.accommodationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter);
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(ratingFilter),
      );
    }

    if (accommodationFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.accommodationId === accommodationFilter,
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, statusFilter, ratingFilter, accommodationFilter]);

  const getStatusBadge = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobada
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        );
      case "flagged":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Flag className="h-3 w-3 mr-1" />
            Marcada
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  const handleModerateReview = async (
    reviewId: string,
    newStatus: Review["status"],
    reason?: string,
  ) => {
    try {
      // In real app, call API
      console.log("Moderating review:", { reviewId, newStatus, reason });

      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                status: newStatus,
                moderationReason: reason,
                updatedAt: new Date(),
              }
            : review,
        ),
      );

      const statusText = {
        approved: "aprobada",
        rejected: "rechazada",
        flagged: "marcada",
        pending: "marcada como pendiente",
      };

      toast.success(`Reseña ${statusText[newStatus]} exitosamente`);
    } catch (error) {
      toast.error("Error al moderar reseña");
    }
  };

  const handleHostResponse = async (reviewId: string, response: string) => {
    try {
      console.log("Adding host response:", { reviewId, response });

      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                hostResponse: {
                  response,
                  respondedAt: new Date(),
                  respondedBy: "Administración",
                },
              }
            : review,
        ),
      );

      toast.success("Respuesta del anfitrión agregada");
    } catch (error) {
      toast.error("Error al agregar respuesta");
    }
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    flagged: reviews.filter((r) => r.status === "flagged").length,
    averageRating:
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
    needingResponse: reviews.filter(
      (r) => r.status === "approved" && !r.hostResponse,
    ).length,
  };

  const uniqueAccommodations = Array.from(
    new Set(reviews.map((r) => r.accommodationId)),
  ).map((id) => ({
    id,
    name:
      reviews.find((r) => r.accommodationId === id)?.accommodationName || id,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reseñas</h1>
        <p className="text-gray-600 mt-2">
          Modera y responde a las reseñas de los huéspedes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-full">
                <Flag className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Marcadas</p>
                <p className="text-2xl font-bold">{stats.flagged}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio</p>
                <p className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar reseñas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="approved">Aprobadas</SelectItem>
                  <SelectItem value="rejected">Rechazadas</SelectItem>
                  <SelectItem value="flagged">Marcadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Calificación</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las calificaciones</SelectItem>
                  <SelectItem value="5">5 estrellas</SelectItem>
                  <SelectItem value="4">4 estrellas</SelectItem>
                  <SelectItem value="3">3 estrellas</SelectItem>
                  <SelectItem value="2">2 estrellas</SelectItem>
                  <SelectItem value="1">1 estrella</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Alojamiento</label>
              <Select
                value={accommodationFilter}
                onValueChange={setAccommodationFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los alojamientos</SelectItem>
                  {uniqueAccommodations.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Acciones</label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setRatingFilter("all");
                  setAccommodationFilter("all");
                }}
                className="w-full"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reseñas ({filteredReviews.length})</CardTitle>
          <CardDescription>
            {stats.needingResponse > 0 && (
              <span className="text-orange-600 font-medium">
                {stats.needingResponse} reseñas necesitan respuesta del
                anfitrión
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Huésped</TableHead>
                <TableHead>Alojamiento</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{review.userName}</div>
                      <div className="text-sm text-gray-500">
                        {review.userEmail}
                      </div>
                      {review.isVerifiedStay && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {review.accommodationName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Estadía: {format(new Date(review.stayDate), "dd/MM/yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StarRatingDisplay rating={review.rating} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{review.title}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {review.comment}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(review.createdAt, "dd/MM/yyyy", { locale: es })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReview(review)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalles de la reseña</DialogTitle>
                            <DialogDescription>
                              Revisa y modera esta reseña
                            </DialogDescription>
                          </DialogHeader>
                          {selectedReview && (
                            <ReviewDetailModal
                              review={selectedReview}
                              onModerate={handleModerateReview}
                              onHostResponse={handleHostResponse}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      {review.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleModerateReview(review.id, "approved")
                            }
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleModerateReview(review.id, "rejected")
                            }
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron reseñas con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Review Detail Modal Component
interface ReviewDetailModalProps {
  review: Review;
  onModerate: (
    reviewId: string,
    status: Review["status"],
    reason?: string,
  ) => void;
  onHostResponse: (reviewId: string, response: string) => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  review,
  onModerate,
  onHostResponse,
}) => {
  const [moderationReason, setModerationReason] = useState("");

  return (
    <div className="space-y-6">
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{review.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Por {review.userName}</span>
            <StarRatingDisplay rating={review.rating} size="sm" />
            <span>
              {format(review.createdAt, "dd/MM/yyyy", { locale: es })}
            </span>
          </div>
        </div>
        {getStatusBadge(review.status)}
      </div>

      {/* Review Content */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Comentario:</h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {review.comment}
          </p>
        </div>

        {review.pros.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Aspectos positivos:</h4>
            <div className="flex flex-wrap gap-2">
              {review.pros.map((pro, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-50 text-green-700"
                >
                  {pro}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {review.cons.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Aspectos a mejorar:</h4>
            <div className="flex flex-wrap gap-2">
              {review.cons.map((con, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-orange-50 text-orange-700"
                >
                  {con}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Moderation Reason */}
      {review.moderationReason && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">
            Razón de moderación:
          </h4>
          <p className="text-yellow-700">{review.moderationReason}</p>
        </div>
      )}

      {/* Host Response */}
      {review.hostResponse ? (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">
            Respuesta del anfitrión:
          </h4>
          <p className="text-blue-700 mb-2">{review.hostResponse.response}</p>
          <div className="text-sm text-blue-600">
            Por {review.hostResponse.respondedBy} el{" "}
            {format(review.hostResponse.respondedAt, "dd/MM/yyyy")}
          </div>
        </div>
      ) : (
        review.status === "approved" && (
          <div>
            <h4 className="font-medium mb-2">
              Agregar respuesta del anfitrión:
            </h4>
            <QuickHostResponse reviewId={review.id} onSubmit={onHostResponse} />
          </div>
        )
      )}

      {/* Moderation Actions */}
      {review.status === "pending" && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Acciones de moderación:</h4>

          <div className="space-y-2">
            <label className="text-sm font-medium">Razón (opcional):</label>
            <Textarea
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder="Describe la razón de la moderación..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                onModerate(review.id, "approved", moderationReason)
              }
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprobar
            </Button>
            <Button
              onClick={() =>
                onModerate(review.id, "rejected", moderationReason)
              }
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
            <Button
              onClick={() => onModerate(review.id, "flagged", moderationReason)}
              variant="outline"
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <Flag className="h-4 w-4 mr-2" />
              Marcar para revisión
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
