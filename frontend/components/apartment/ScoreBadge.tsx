export function ScoreBadge({ rating, reviews }: { rating: string; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-right">
        <p className="text-xs text-[#0057FF] font-semibold">Excellent</p>
        <p className="text-xs text-gray-400">{reviews} reviews</p>
      </div>
      <div className="w-9 h-9 bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center justify-center">
        {rating}
      </div>
    </div>
  );
}