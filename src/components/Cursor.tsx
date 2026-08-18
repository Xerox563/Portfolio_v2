import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "default" | "hover" | "text" | "view";

export function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hidden, setHidden] = useState(true);
  const [variant, setVariant] = useState<CursorState>("default");

  // outer ring — slow, eased follow
  const ringX = useSpring(mouseX, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 350, damping: 28, mass: 0.6 });
  // inner dot — snappy
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 50 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setHidden(false);
    };
    const leave = () => setHidden(true);
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor='view']")) setVariant("view");
      else if (t.closest("[data-cursor='text'], textarea, input")) setVariant("text");
      else if (t.closest("a, button, [data-cursor='hover']")) setVariant("hover");
      else setVariant("default");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [mouseX, mouseY]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches)
    return null;

  const ringSize = variant === "view" ? 92 : variant === "hover" ? 56 : 34;
  const ringOpacity = hidden ? 0 : variant === "default" ? 0.4 : 1;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="cursor-ring"
        data-variant={variant}
      >
        <motion.div
          className="cursor-ring__inner"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: ringOpacity,
            borderColor:
              variant === "view" ? "var(--accent)" : "rgba(255,255,255,0.7)",
          }}
          transition={{ type: "spring", stiffness: 250, damping: 22 }}
        />
        {variant === "view" && (
          <motion.span
            className="cursor-ring__label"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            View
          </motion.span>
        )}
      </motion.div>

      <motion.div
        aria-hidden
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: hidden || variant !== "default" ? 0 : 1, scale: variant === "default" ? 1 : 0 }}
      />
    </>
  );
}
