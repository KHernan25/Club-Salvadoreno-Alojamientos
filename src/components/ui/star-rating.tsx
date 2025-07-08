import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
  precision?: "full" | "half";
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  size = "md",
  readonly = false,
  showValue = false,
  precision = "full",
  className,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  const renderStar = (index: number) => {
    const starValue = index + 1;
    let fillPercentage = 0;

    if (precision === "half") {
      if (displayRating >= starValue) {
        fillPercentage = 100;
      } else if (displayRating >= starValue - 0.5) {
        fillPercentage = 50;
      }
    } else {
      fillPercentage = displayRating >= starValue ? 100 : 0;
    }

    return (
      <div
        key={index}
        className={cn(
          "relative",
          !readonly && "cursor-pointer",
          sizeClasses[size],
        )}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
      >
        <Star
          className={cn("absolute inset-0 text-gray-300", sizeClasses[size])}
          fill="currentColor"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star
            className={cn("text-yellow-400", sizeClasses[size])}
            fill="currentColor"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => renderStar(index))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};

interface StarRatingDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating,
  totalReviews,
  size = "md",
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <StarRating rating={rating} size={size} readonly precision="half" />
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)}
        {totalReviews !== undefined && (
          <span className="text-gray-400"> ({totalReviews} reseñas)</span>
        )}
      </span>
    </div>
  );
};
