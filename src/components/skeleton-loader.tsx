export function SkeletonLoader() {
  return (
    <div className="w-full rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent p-6 animate-pulse">
      {/* Visual Image Node Block Shimmer */}
      <div className="aspect-[4/3] w-full rounded-2xl bg-white/[0.03]" />
      <div className="mt-5 space-y-3">
        {/* Category Tag Shimmer */}
        <div className="h-3 w-1/4 rounded bg-white/[0.02]" />
        {/* Main Title Shimmer */}
        <div className="h-5 w-3/4 rounded bg-white/[0.03]" />
        {/* Subtitle Line Shimmer */}
        <div className="h-3 w-full rounded bg-white/[0.02]" />
        <div className="h-3 w-5/6 rounded bg-white/[0.02]" />
        {/* Price Bottom Row Shimmer */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
          <div className="h-6 w-1/3 rounded bg-white/[0.03]" />
          <div className="h-9 w-9 rounded-full bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}
