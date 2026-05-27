interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({
  rating, size = 14,
}: StarRatingProps) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={
            i < Math.floor(rating)
              ? "#f59e0b"
              : i === Math.floor(rating) && rating % 1 >= 0.5
              ? `url(#half-${i})`
              : "#e5e7eb"
          }
        >
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>

          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}