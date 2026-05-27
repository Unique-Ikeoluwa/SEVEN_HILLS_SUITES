export function AmenityBadges({ freeCancellation, breakfastIncluded }: { freeCancellation: boolean; breakfastIncluded: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {freeCancellation && (
        <span className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Free cancellation
        </span>
      )}
      {breakfastIncluded && (
        <span className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          Breakfast included
        </span>
      )}
    </div>
  );
}