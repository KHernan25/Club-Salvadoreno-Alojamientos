import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRatingDisplay } from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ThumbsUp,
  Calendar,
  CheckCircle,
  MessageSquare,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  isVerifiedStay: boolean;
  stayDate: string;
  createdAt: Date;
  helpfulVotes: number;
  hostResponse?: {
    response: string;
    respondedAt: Date;
    respondedBy: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recommendationRate: number;
}

interface ReviewListProps {
  reviews: Review[];
  stats: ReviewStats;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  onHelpfulVote?: (reviewId: string) => void;
  onFilterChange?: (filters: { rating?: number; sortBy?: string }) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  stats,
  onLoadMore,
  hasMore = false,
  loading = false,
  onHelpfulVote,
  onFilterChange,
}) => {
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        rating: ratingFilter === "all" ? undefined : parseInt(ratingFilter),
        sortBy,
      });
    }
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [ratingFilter, sortBy]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MMMM yyyy", { locale: es });
  };

  const RatingBar = ({ rating, count }: { rating: number; count: number }) => {
    const percentage =
      stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-2">{rating}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reseñas de huéspedes
          </CardTitle>
          <CardDescription>
            {stats.totalReviews} reseñas de huéspedes verificados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </div>
                <StarRatingDisplay
                  rating={stats.averageRating}
                  size="lg"
                  className="justify-center"
                />
                <div className="text-sm text-gray-600 mt-1">
                  Basado en {stats.totalReviews} reseñas
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {stats.recommendationRate.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">
                  de huéspedes lo recomiendan
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Distribución de calificaciones
              </h4>
              {[5, 4, 3, 2, 1].map((rating) => (
                <RatingBar
                  key={rating}
                  rating={rating}
                  count={
                    stats.ratingDistribution[
                      rating as keyof typeof stats.ratingDistribution
                    ]
                  }
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-48">
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="oldest">Más antiguas</SelectItem>
                <SelectItem value="highest">Mejor calificación</SelectItem>
                <SelectItem value="lowest">Menor calificación</SelectItem>
                <SelectItem value="helpful">Más útiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(review.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.userName}</span>
                        {review.isVerifiedStay && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Estadía verificada
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        Estadía en {formatDate(review.stayDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRatingDisplay rating={review.rating} size="sm" />
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-lg">{review.title}</h4>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>

                {/* Pros and Cons */}
                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {review.pros.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">
                          Lo que más me gustó:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {review.pros.map((pro, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-green-50 text-green-700"
                            >
                              {pro}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div>
                        <h5 className="font-medium text-orange-700 mb-2">
                          Aspectos a mejorar:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {review.cons.map((con, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-orange-50 text-orange-700"
                            >
                              {con}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendation */}
                {review.wouldRecommend && (
                  <div className="flex items-center gap-2 text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Recomendaría este alojamiento
                    </span>
                  </div>
                )}

                {/* Host Response */}
                {review.hostResponse && (
                  <>
                    <Separator />
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-blue-700">
                          Respuesta del anfitrión
                        </Badge>
                        <span className="text-xs text-gray-600">
                          {formatDate(review.hostResponse.respondedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {review.hostResponse.response}
                      </p>
                      <div className="text-xs text-gray-600 mt-2">
                        - {review.hostResponse.respondedBy}
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHelpfulVote?.(review.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Útil ({review.helpfulVotes})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? "Cargando..." : "Ver más reseñas"}
          </Button>
        </div>
      )}

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay reseñas aún
            </h3>
            <p className="text-gray-600">
              Sé el primero en compartir tu experiencia en este alojamiento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
