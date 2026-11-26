"use client";

import React, { useState } from "react";
import { Review } from "@/lib/types";
import { RatingStars } from "./RatingStars";
import { ThumbsUp, CheckCircle, ShieldCheck } from "lucide-react";

interface ReviewSectionProps {
  rating: number;
  ratingCount: number;
  reviewCount: number;
  reviews?: Review[];
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-1",
    userName: "Amit Kumar",
    rating: 5,
    title: "Terrific purchase! Outstanding performance.",
    comment: "Simply stunning build quality. The battery life easily lasts full day under heavy usage. Camera samples are exceptionally sharp with natural color tones.",
    date: "18 Nov 2024",
    verifiedPurchase: true,
    helpfulCount: 245,
    location: "Bengaluru, Karnataka",
  },
  {
    id: "rev-2",
    userName: "Pooja Mehta",
    rating: 5,
    title: "Mind-blowing! Value for money.",
    comment: "Received the delivery within 24 hours via BharatKart Plus. The packaging was immaculate. Setup took less than 10 minutes. Highly recommended!",
    date: "12 Nov 2024",
    verifiedPurchase: true,
    helpfulCount: 182,
    location: "Mumbai, Maharashtra",
  },
  {
    id: "rev-3",
    userName: "Vikram Sengupta",
    rating: 4,
    title: "Good choice with minor room for improvement",
    comment: "The build and materials are top notch. Display clarity is breathtaking. Thermals stay cool even during gaming sessions.",
    date: "04 Nov 2024",
    verifiedPurchase: true,
    helpfulCount: 89,
    location: "Kolkata, West Bengal",
  },
];

export function ReviewSection({
  rating,
  ratingCount,
  reviewCount,
  reviews = DEFAULT_REVIEWS,
}: ReviewSectionProps) {
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const handleVote = (id: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const isBrandNew = ratingCount === 0 || rating === 0;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-sm p-4 md:p-6 mt-6">
      <h3 className="text-base md:text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 mb-6">
        Ratings & Reviews
      </h3>

      {isBrandNew ? (
        <div className="text-center py-8 px-4 bg-gray-50 border border-dashed border-gray-200 rounded-sm">
          <ShieldCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gray-800">No ratings or customer reviews yet</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            This item is newly listed in the BharatKart marketplace. Be the first certified customer to purchase and share your feedback!
          </p>
        </div>
      ) : (
        <>
          {/* Ratings Overview Bar */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-6 border-b border-gray-100">
            {/* Overall score */}
            <div className="text-center md:text-left shrink-0">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  {rating.toFixed(1)}
                </span>
                <span className="text-2xl text-amber-500">★</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {ratingCount.toLocaleString("en-IN")} Ratings &<br />
                {reviewCount.toLocaleString("en-IN")} Reviews
              </p>
            </div>

            {/* Rating bars */}
            <div className="flex-1 w-full max-w-md space-y-1.5 text-xs text-gray-600">
              {[
                { star: 5, pct: 72, count: Math.round(ratingCount * 0.72).toLocaleString("en-IN"), color: "bg-[#388e3c]" },
                { star: 4, pct: 18, count: Math.round(ratingCount * 0.18).toLocaleString("en-IN"), color: "bg-[#388e3c]" },
                { star: 3, pct: 6, count: Math.round(ratingCount * 0.06).toLocaleString("en-IN"), color: "bg-[#ff9f00]" },
                { star: 2, pct: 2, count: Math.round(ratingCount * 0.02).toLocaleString("en-IN"), color: "bg-[#ff9f00]" },
                { star: 1, pct: 2, count: Math.round(ratingCount * 0.02).toLocaleString("en-IN"), color: "bg-red-500" },
              ].map((bar) => (
                <div key={bar.star} className="flex items-center gap-2">
                  <span className="w-6 text-right font-medium">{bar.star} ★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar.color} rounded-full`}
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-gray-400 text-[11px]">{bar.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Review Items */}
          <div className="divide-y divide-gray-100">
            {reviews.map((rev) => {
              const userVoted = (helpfulVotes[rev.id] || 0) > 0;
              const currentHelpful = rev.helpfulCount + (helpfulVotes[rev.id] || 0);

              return (
                <div key={rev.id} className="py-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rev.rating} size="sm" />
                    <h4 className="text-xs md:text-sm font-bold text-gray-900">{rev.title}</h4>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-600">{rev.userName}</span>
                      {rev.location && <span>• {rev.location}</span>}
                      <span>• {rev.date}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[#388e3c] font-semibold flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" /> Certified Buyer
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleVote(rev.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        userVoted ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{currentHelpful}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
