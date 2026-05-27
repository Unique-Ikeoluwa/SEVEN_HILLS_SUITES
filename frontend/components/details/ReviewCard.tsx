import { Review } from "@/types/review";
import StarRating from "../ui/StarRating";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 mb-1">{review.name}</p>
        <StarRating rating={review.rating} size={13}/>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.text}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span>{review.time}</span>
          <button className="hover:text-gray-600 transition-colors">Like</button>
          <button className="hover:text-gray-600 transition-colors">Reply</button>
        </div>
      </div>
    </div>
  );
}