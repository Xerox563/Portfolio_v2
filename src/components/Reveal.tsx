import {
  motion,
  useInView,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  direction?: Direction;
  once?: boolean;
  amount?: number;
  as?: keyof typeof motion;
}

const offset = (dir: Direction, dist: number) => {
  switch (dir) {
    case "up":
      return { y: dist, x: 0 };
    case "down":
      return { y: -dist, x: 0 };
    case "left":
      return { y: 0, x: dist };
    case "right":
      return { y: 0, x: -dist };
    default:
      return { y: 0, x: 0 };
  }
};

/** Fade + slide reveal when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y,
  x,
  direction = "up",
  once = true,
  amount = 0.3,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  const dist = 40;
  const base = direction === "none" ? { y: 0, x: 0 } : offset(direction, dist);
  const targetY = y ?? base.y;
  const targetX = x ?? base.x;

  const variants: Variants = {
    hidden: { opacity: 0, y: targetY, x: targetX, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container — children use RevealItem. */
export function Stagger({
  children,
  delay = 0,
  gap = 0.08,
  amount = 0.3,
  className,
}: {
  children: ReactNode;
  delay?: number;
  gap?: number;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  y = 24,
  className,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
