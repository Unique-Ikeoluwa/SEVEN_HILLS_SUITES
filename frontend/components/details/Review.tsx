"use client";
import StarRating from "../ui/StarRating";
import { useState } from "react";
import { MOCK_APARTMENT } from "@/data/apartments";
import { ReviewCard } from "./ReviewCard";

export function Review() {

    const apt = MOCK_APARTMENT;
    const [reviewText, setReviewText] = useState("");
    const [visibleReviews, setVisibleReviews] = useState(2);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const handleShareReview = () => {
        if (!reviewText.trim()) return;
        setReviewSubmitted(true);
        setReviewText("");
        setTimeout(() => setReviewSubmitted(false), 3000);
    };

    return (
        <section className="bg-gray-50 rounded-2xl p-4 sm:p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-base font-bold text-gray-900 border-b-2 border-gray-900 inline-block pb-1">Reviews</h2>
            </div>
            <div className="flex items-center gap-2 mb-1">
                <StarRating rating={apt.rating} size={16} />
                <span className="text-sm text-gray-500">{apt.reviewCount} Reviews</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-5">
                {["Excellent", "Great", "Very Good", "Good"][Math.floor(apt.rating) - 2] ?? "Good"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleShareReview()}
                    placeholder="Share your thoughts"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
                />
                <button
                    onClick={handleShareReview}
                    className="px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors sm:shrink-0"
                    >
                    {reviewSubmitted ? "Shared!" : "Share review"}
                </button>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{apt.reviewCount} Reviews</h3>
            <div>
                {apt.reviews.slice(0, visibleReviews).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
            {visibleReviews < apt.reviews.length && (
                <button
                    onClick={() => setVisibleReviews((v) => v + 3)}
                    className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                    see more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 8 16 12 12 16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                </button>
            )}
        </section>
    );
}