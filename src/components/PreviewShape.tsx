import type { ProjectShape } from "../lib/content";

export function PreviewShape({ shape }: { shape: ProjectShape }) {
  switch (shape) {
    case "ring":
      return (
        <svg viewBox="0 0 200 200" className="preview-shape">
          <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="3" fill="rgba(0,0,0,0.7)" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 200 200" className="preview-shape">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={20 + c * 28}
                y={20 + r * 28}
                width={22}
                height={22}
                rx={6}
                fill="rgba(0,0,0,0.18)"
              />
            ))
          )}
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 200 200" className="preview-shape">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M0 ${60 + i * 22} C 40 ${40 + i * 22}, 80 ${80 + i * 22}, 120 ${60 + i * 22} S 200 ${60 + i * 22}, 200 ${60 + i * 22}`}
              fill="none"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="2"
            />
          ))}
        </svg>
      );
    case "aura":
      return (
        <svg viewBox="0 0 200 200" className="preview-shape">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="100" cy="100" r={28 + i * 22} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
          ))}
          <circle cx="100" cy="100" r="22" fill="rgba(0,0,0,0.55)" />
        </svg>
      );
  }
}