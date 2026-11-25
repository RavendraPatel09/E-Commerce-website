import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({ rating, count, reviewCount, size = "sm" }: RatingStarsProps) {
  const sizeClasses = {
    sm: "text-[12px] px-1.5 py-0.5",
    md: "text-[13px] px-2 py-0.5",
    lg: "text-sm px-2.5 py-1 font-bold",
  };

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  // Determine color based on rating
  const bgColor = rating >= 4.0 ? "bg-[#388e3c]" : rating >= 3.0 ? "bg-[#ff9f00]" : "bg-red-500";

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center gap-0.5 font-bold text-white rounded-[3px] leading-none ${bgColor} ${sizeClasses[size]}`}
      >
        <span>{rating.toFixed(1)}</span>
        <Star className={`${starSizes[size]} fill-white stroke-none`} />
      </span>

      {count !== undefined && (
        <span className="text-[12px] text-gray-500 font-medium">
          {reviewCount !== undefined ? (
            <span>
              {count.toLocaleString("en-IN")} Ratings & {reviewCount.toLocaleString("en-IN")} Reviews
            </span>
          ) : (
            <span>({count.toLocaleString("en-IN")})</span>
          )}
        </span>
      )}
    </div>
  );
}
