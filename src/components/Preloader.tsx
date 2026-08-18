import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "../lib/content";

export function Preloader({ onDone }: { onDone: () => void }) {
  const { identity } = useContent();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      initial={false}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="preloader__bar">
        <motion.div
          className="preloader__bar-fill"
          animate={{ scaleX: count / 100 }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>
      <div className="preloader__content">
        <span className="preloader__label">{identity.name} © {new Date().getFullYear()}</span>
        <span className="preloader__count">{count}</span>
      </div>
    </motion.div>
  );
}
