import { useEffect, useMemo, useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

/**
 * Returns scroll-driven transforms for parallax, scoped to the referenced element.
 * speed: positive = moves slower than scroll (up), negative = moves down.
 */
export function useParallax<T extends HTMLElement>(speed = 0.3) {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  const smoothY = useSpring(y, { stiffness: 120, damping: 30, mass: 0.4 });
  return { ref, y: smoothY, scrollYProgress };
}

/** Wrap a motion value in a spring for buttery follow effects. */
export function useSmoothValue(value: MotionValue<number>, opts?: Parameters<typeof useSpring>[1]) {
  return useSpring(value, { stiffness: 150, damping: 20, mass: 0.5, ...opts });
}

/** Tracks which section id is currently in view. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const observer = useMemo<IntersectionObserver | null>(() => {
    if (typeof IntersectionObserver === "undefined") return null;
    return new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
  }, []);

  useEffect(() => {
    if (!observer) return;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, observer]);

  return active;
}
