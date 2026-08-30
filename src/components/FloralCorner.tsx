"use client";

/**
 * Procedural watercolor-style rose cluster used to frame cards and corners.
 * Pure SVG so it scales crisply and can be tinted per-instance.
 */
export default function FloralCorner({
  className = "",
  flip = false,
  style,
}: {
  className?: string;
  flip?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        ...style,
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id="roseA" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fbe3df" />
          <stop offset="55%" stopColor="#ecb6b0" />
          <stop offset="100%" stopColor="#d68d8a" />
        </radialGradient>
        <radialGradient id="roseB" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fff2ec" />
          <stop offset="60%" stopColor="#f3cfc4" />
          <stop offset="100%" stopColor="#e0a59c" />
        </radialGradient>
        <radialGradient id="leaf" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#cdd8b7" />
          <stop offset="100%" stopColor="#9fb487" />
        </radialGradient>
      </defs>

      {/* leaves */}
      <g opacity="0.9">
        <path
          d="M30 150 C 10 120, 40 90, 70 95 C 60 120, 55 145, 30 150 Z"
          fill="url(#leaf)"
        />
        <path
          d="M150 40 C 180 25, 205 55, 195 85 C 170 78, 150 65, 150 40 Z"
          fill="url(#leaf)"
        />
        <path
          d="M180 150 C 205 140, 215 170, 195 188 C 182 172, 176 162, 180 150 Z"
          fill="url(#leaf)"
        />
      </g>

      {/* rose helper drawn three times at different scales */}
      {(
        [
          { x: 70, y: 70, s: 1.15, g: "url(#roseA)" },
          { x: 150, y: 110, s: 0.85, g: "url(#roseB)" },
          { x: 95, y: 155, s: 0.7, g: "url(#roseB)" },
        ] as const
      ).map((r, i) => (
        <g
          key={i}
          transform={`translate(${r.x} ${r.y}) scale(${r.s})`}
          fill={r.g}
        >
          <circle r="34" opacity="0.55" />
          <path
            d="M0 -30 C 16 -30, 28 -16, 28 0 C 28 16, 16 28, 0 28 C -16 28, -28 16, -28 0 C -28 -16, -16 -30, 0 -30 Z"
            opacity="0.85"
          />
          <path
            d="M0 -20 C 12 -20, 20 -10, 18 2 C 16 14, 6 20, 0 18 C -10 20, -18 12, -18 0 C -18 -12, -10 -20, 0 -20 Z"
            opacity="0.9"
            fill="#fff"
            fillOpacity="0.18"
          />
          <path
            d="M0 -12 C 8 -14, 14 -6, 11 3 C 8 11, 0 13, -4 10 C -11 11, -13 2, -10 -4 C -7 -10, -4 -11, 0 -12 Z"
            fill="#fff"
            fillOpacity="0.28"
          />
          <circle r="4" fill="#b5746f" opacity="0.7" />
        </g>
      ))}

      {/* tiny buds */}
      <circle cx="40" cy="60" r="7" fill="url(#roseA)" opacity="0.85" />
      <circle cx="175" cy="175" r="9" fill="url(#roseB)" opacity="0.85" />
    </svg>
  );
}
