"use client";

import StarRating from "../ui/StarRating";
import { useState } from "react";
import { APIApartment } from "@/types/apartment";

interface ReviewProps {
  apartment: APIApartment;
}

export function Review({ apartment }: ReviewProps) {
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const mockRating = 4.5;
  const mockReviewCount = 0;

  const handleShareReview = () => {
    if (!reviewText.trim()) return;
    setReviewSubmitted(true);
    setReviewText("");
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <section className="bg-gray-50 rounded-2xl p-4 sm:p-6">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-base font-bold text-gray-900 border-b-2 border-gray-900 inline-block pb-1">
          Reviews Center
        </h2>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <StarRating rating={mockRating} size={16} />
        <span className="text-sm text-gray-500">{mockReviewCount} Reviews</span>
      </div>
      
      <p className="text-sm font-semibold text-gray-800 mb-5">Excellent</p>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleShareReview()}
          placeholder="Share your thoughts regarding this apartment suite..."
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
        />
        <button
          onClick={handleShareReview}
          className="px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors sm:shrink-0"
        >
          {reviewSubmitted ? "Shared!" : "Share review"}
        </button>
      </div>

      <div className="text-center py-6 text-xs font-medium text-gray-400 bg-white border border-gray-100 rounded-xl">
        No verified guest stay reviews logged for this listing yet.
      </div>
    </section>
  );
}
