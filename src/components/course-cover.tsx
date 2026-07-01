type Props = {
  accent: string;
  glyph: string;
  title: string;
  level?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function CourseCover({
  accent,
  glyph,
  title,
  level,
  className = "",
  size = "md",
}: Props) {
  const { r, g, b } = hexToRgb(accent);
  const dark = `rgb(${Math.round(r * 0.45)}, ${Math.round(g * 0.45)}, ${Math.round(
    b * 0.45,
  )})`;
  const glyphSize =
    size === "lg" ? "text-[10rem]" : size === "sm" ? "text-6xl" : "text-8xl";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, ${dark} 100%)`,
      }}
    >
      {/* halo */}
      <div
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-40 blur-2xl"
        style={{ background: "rgba(255,255,255,0.55)" }}
      />
      <div
        className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{ background: "rgba(255,255,255,0.4)" }}
      />
      {/* grain overlay */}
      <div className="grain absolute inset-0 opacity-30" />
      {/* concentric rings */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="160" cy="40" r="60" fill="none" stroke="white" strokeWidth="1" />
        <circle cx="160" cy="40" r="90" fill="none" stroke="white" strokeWidth="1" />
        <circle cx="30" cy="170" r="50" fill="none" stroke="white" strokeWidth="1" />
      </svg>
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
            AfruzStore
          </span>
          {level ? (
            <span className="rounded-full bg-black/20 px-3 py-1 text-[0.65rem] font-medium text-white/90 backdrop-blur">
              {level}
            </span>
          ) : null}
        </div>
        <div
          className={`pointer-events-none select-none self-center ${glyphSize} font-display leading-none text-white/90 drop-shadow-lg`}
        >
          {glyph}
        </div>
        <p className="font-display text-lg font-semibold leading-tight text-white drop-shadow">
          {title}
        </p>
      </div>
    </div>
  );
}
