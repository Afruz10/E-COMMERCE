type Props = {
  rating: number;
  size?: number;
  className?: string;
};

export function Stars({ rating, size = 16, className = "" }: Props) {
  const full = Math.floor(rating);
  const frac = rating - full;
  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        let fill = 0;
        if (i < full) fill = 1;
        else if (i === full) fill = frac;
        return <Star key={i} fill={fill} size={size} />;
      })}
    </span>
  );
}

function Star({ fill, size }: { fill: number; size: number }) {
  const id = `star-${Math.random().toString(36).slice(2)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
          <stop offset={`${fill * 100}%`} stopColor="#d6d3cd" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}
