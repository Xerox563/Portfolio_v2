import type { CSSProperties } from "react";

export interface BackdropOrb {
  color: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  speed: number;
  opacity?: number;
  direction?: "vertical" | "horizontal" | "rotate" | "scale" | "opacity";
}

interface SectionBackdropProps {
  orbs: BackdropOrb[];
  gridSpeed?: number;
  showCurtain?: boolean;
  curtainColor?: string;
  id?: string;
}

export function SectionBackdrop({
  orbs,
  gridSpeed = 0.12,
  showCurtain = true,
  curtainColor = "var(--bg)",
  id,
}: SectionBackdropProps) {
  const orbStyle = (o: BackdropOrb): CSSProperties => {
    const alpha = Math.round((o.opacity ?? 0.16) * 255)
      .toString(16)
      .padStart(2, "0");
    return {
      background: `radial-gradient(circle at 50% 50%, ${o.color}${alpha}, ${o.color}00 70%)`,
      width: o.size,
      height: o.size,
      top: o.top,
      left: o.left,
      right: o.right,
      bottom: o.bottom,
    };
  };

  return (
    <div className="section__bg" aria-hidden id={id}>
      {orbs.map((o, i) => (
        <span
          key={i}
          className="section__orb"
          style={orbStyle(o)}
          data-parallax-layer
          data-parallax-speed={o.speed}
          data-parallax-direction={o.direction ?? "vertical"}
          data-parallax-scrub="1.2"
        />
      ))}
      <span
        className="section__grid"
        data-parallax-layer
        data-parallax-speed={gridSpeed}
        data-parallax-scrub="1.2"
      />
      {showCurtain && (
        <span
          className="section__curtain"
          data-curtain
          style={{ background: curtainColor }}
        />
      )}
    </div>
  );
}