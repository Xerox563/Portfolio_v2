import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useContent } from "../lib/content";

const DURATION = 2200;

/* ── tiny easing helpers ── */
const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

/* ── split name into letter spans ── */
function Letters({ text, show }: { text: string; show: boolean }) {
  return (
    <span
      aria-label={text}
      style={{ display: "flex", gap: "0.02em", overflow: "hidden" }}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", willChange: "transform, opacity" }}
          initial={{ y: "110%", opacity: 0 }}
          animate={show ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
          transition={{
            duration: 0.75,
            ease: easeOutExpo,
            delay: show ? 0.12 + i * 0.038 : 0,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ── circular progress arc ── */
function ProgressArc({ progress }: { progress: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="pl__arc">
      {/* track */}
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />
      {/* fill */}
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#c8ff5e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 0.08s linear" }}
      />
      {/* dot at tip */}
      <circle
        cx={60 + r * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
        cy={60 + r * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
        r="2.5"
        fill="#c8ff5e"
        style={{ transition: "cx 0.08s linear, cy 0.08s linear" }}
      />
    </svg>
  );
}

/* ── animated grid lines ── */
function GridLines({ show }: { show: boolean }) {
  const lines = [0.25, 0.5, 0.75];
  return (
    <div className="pl__grid" aria-hidden>
      {lines.map((pos, i) => (
        <motion.div
          key={`h${i}`}
          className="pl__grid-line pl__grid-line--h"
          style={{ top: `${pos * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={show ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 1.4,
            ease: easeOutExpo,
            delay: 0.05 + i * 0.1,
          }}
        />
      ))}
      {lines.map((pos, i) => (
        <motion.div
          key={`v${i}`}
          className="pl__grid-line pl__grid-line--v"
          style={{ left: `${pos * 100}%` }}
          initial={{ scaleY: 0 }}
          animate={show ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{
            duration: 1.4,
            ease: easeOutExpo,
            delay: 0.1 + i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/* ── corner brackets ── */
function Corners({ show }: { show: boolean }) {
  const corners = [
    { top: "2rem", left: "2rem", r: 0 },
    { top: "2rem", right: "2rem", r: 90 },
    { bottom: "2rem", right: "2rem", r: 180 },
    { bottom: "2rem", left: "2rem", r: 270 },
  ] as const;
  return (
    <>
      {corners.map((style, i) => (
        <motion.div
          key={i}
          className="pl__corner"
          style={style as React.CSSProperties}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
          transition={{
            duration: 0.6,
            ease: easeOutExpo,
            delay: 0.08 + i * 0.06,
          }}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d={`M 0 12 L 0 0 L 12 0`}
              stroke="#c8ff5e"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform={`rotate(${style.r} 10 10)`}
            />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* ── floating tag ── */
function FloatTag({
  text,
  delay,
  style,
}: {
  text: string;
  delay: number;
  style: React.CSSProperties;
}) {
  return (
    <motion.span
      className="pl__tag"
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.55, ease: easeOutExpo, delay }}
      aria-hidden
    >
      {text}
    </motion.span>
  );
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const { identity } = useContent();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [lettersIn, setLettersIn] = useState(false);
  const [showExtras, setShowExtras] = useState(false);

  useEffect(() => {
    /* stagger letters after a short delay */
    const t1 = setTimeout(() => setLettersIn(true), 80);
    const t2 = setTimeout(() => setShowExtras(true), 300);

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("hold");
        setTimeout(() => setPhase("out"), 220);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* top panel slides up, bottom slides down */
  const exitVariants = {
    topPanel: {
      initial: { y: 0 },
      exit: {
        y: "-100%",
        transition: { duration: 0.85, ease: easeInOutQuart },
      },
    },
    bottomPanel: {
      initial: { y: 0 },
      exit: { y: "100%", transition: { duration: 0.85, ease: easeInOutQuart } },
    },
  };

  const isExiting = phase === "out";

  /* fire onDone after exit animation completes */
  useEffect(() => {
    if (phase === "out") {
      const t = setTimeout(onDone, 860);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  const [nameLine1, nameLine2] = identity.name.split(" ");
  const progress = count / 100;

  return (
    <div className="pl" role="status" aria-label="Loading">
      {/* TOP PANEL */}
      <motion.div
        className="pl__panel pl__panel--top"
        variants={exitVariants.topPanel}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
      >
        <GridLines show={!isExiting} />
        <Corners show={!isExiting} />

        {/* name */}
        <div className="pl__name" aria-label={identity.name}>
          <div className="pl__name-line">
            <Letters text={nameLine1} show={lettersIn && !isExiting} />
          </div>
          <div className="pl__name-line pl__name-line--offset">
            <Letters text={nameLine2} show={lettersIn && !isExiting} />
          </div>
        </div>

        {/* floating role tag */}
        <AnimatePresence>
          {showExtras && !isExiting && (
            <FloatTag
              text={identity.role}
              delay={0}
              style={{ position: "absolute", bottom: "2.2rem", left: "2.5rem" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* BOTTOM PANEL */}
      <motion.div
        className="pl__panel pl__panel--bottom"
        variants={exitVariants.bottomPanel}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
      >
        {/* progress arc + counter */}
        <div className="pl__meter">
          <ProgressArc progress={progress} />
          <span className="pl__count" aria-hidden>
            {String(count).padStart(2, "0")}
          </span>
        </div>

        {/* animated status line */}
        <AnimatePresence>
          {showExtras && !isExiting && (
            <motion.div
              className="pl__status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <motion.span
                className="pl__status-dot"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                }}
              />
              <span className="mono pl__status-text">
                {count < 40
                  ? "Initialising systems"
                  : count < 80
                    ? "Loading assets"
                    : "Almost there"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* bottom label */}
        <span className="mono pl__copy">{`${new Date().getFullYear()} — PORTFOLIO`}</span>
      </motion.div>
    </div>
  );
}
