import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface MarqueeProps {
  items: string[];
  direction?: "rtl" | "ltr";
  speed?: number;
  className?: string;
}

/** Infinite marquee that also drifts on scroll for added depth. */
export function Marquee({
  items,
  direction = "rtl",
  speed = 1,
  className,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "rtl" ? [-60, 60] : [60, -60]
  );

  return (
    <section
      ref={ref}
      className={`marquee ${className ?? ""}`}
      data-direction={direction}
      style={{ "--speed": speed } as React.CSSProperties}
    >
      <motion.div className="marquee__track" style={{ x: drift }}>
        <div className="marquee__row">
          {[0, 1].map((dup) =>
            items.map((it, i) => (
              <span key={`${dup}-${i}`} className="marquee__item" aria-hidden={dup > 0}>
                {it}
                <span className="marquee__sep">✦</span>
              </span>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}
