import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../lib/content";

const DURATION = 3200;

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const easeInOutQuart = [0.76, 0, 0.24, 1] as const;
const easeSpring = [0.34, 1.56, 0.64, 1] as const;

function Letters({ text, show, className }: { text: string; show: boolean; className?: string }) {
  return (
    <span aria-label={text} className={`pl__letters ${className || ""}`} style={{ display: "flex", gap: "0.02em", overflow: "hidden" }}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", willChange: "transform, opacity" }}
          initial={{ y: "120%", opacity: 0, rotateX: -15 }}
          animate={show ? { y: "0%", opacity: 1, rotateX: 0 } : { y: "-120%", opacity: 0, rotateX: 15 }}
          transition={{
            duration: 0.85,
            ease: easeOutExpo,
            delay: show ? 0.15 + i * 0.045 : 0,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  const angle = 2 * Math.PI * progress - Math.PI / 2;
  const dotX = 60 + r * Math.cos(angle);
  const dotY = 60 + r * Math.sin(angle);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="pl__ring-svg" aria-hidden>
      <defs>
        <linearGradient id="pl-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8ff5e" />
          <stop offset="50%" stopColor="#5ec8ff" />
          <stop offset="100%" stopColor="#9b7bff" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="url(#pl-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 0.1s linear", filter: "drop-shadow(0 0 8px rgba(200,255,94,0.4))" }}
      />
      <circle cx={dotX} cy={dotY} r="3.5" fill="#c8ff5e" style={{ filter: "drop-shadow(0 0 6px #c8ff5e)" }} />
    </svg>
  );
}

function GridField({ show }: { show: boolean }) {
  const cols = 8;
  const rows = 8;
  const cells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const delay = (r * cols + c) * 0.008;
      cells.push(
        <motion.div
          key={`${r}-${c}`}
          className="pl__cell"
          style={{
            "--c": c,
            "--r": r,
            "--cols": cols,
            "--rows": rows,
          } as React.CSSProperties}
          initial={{ scale: 0, opacity: 0, rotate: 180 }}
          animate={show ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0, opacity: 0, rotate: -180 }}
          transition={{
            duration: 0.6,
            ease: easeOutExpo,
            delay: show ? 0.2 + delay : 0,
          }}
        />
      );
    }
  }

  return <div className="pl__grid-field" aria-hidden>{cells}</div>;
}

function OrbitSystem({ show }: { show: boolean }) {
  const orbits = [1, 2, 3].map((_, i) => {
    const dots = 6 + i * 3;
    return (
      <motion.div
        key={i}
        className="pl__orbit"
        style={{ "--size": 80 + i * 70 } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.3 + i * 0.15 }}
      >
        {Array.from({ length: dots }).map((_, d) => (
          <motion.div
            key={d}
            className="pl__orbit-dot"
            style={{
              "--angle": (360 / dots) * d,
              "--delay": d * 0.05,
            } as React.CSSProperties}
            initial={{ opacity: 0, scale: 0 }}
            animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, ease: easeSpring, delay: show ? 0.5 + d * 0.03 : 0 }}
          />
        ))}
      </motion.div>
    );
  });

  return <div className="pl__orbits" aria-hidden>{orbits}</div>;
}

function ScanLine({ show }: { show: boolean }) {
  return (
    <motion.div
      className="pl__scan"
      initial={{ y: "-100%", opacity: 0 }}
      animate={show ? { y: "100%", opacity: 1 } : { y: "100%", opacity: 0 }}
      transition={{ duration: 2.8, ease: "linear", repeat: Infinity, delay: show ? 0.4 : 0 }}
    />
  );
}

function GlitchText({ text, intensity = 1 }: { text: string; intensity?: number }) {
  return (
    <span className="pl__glitch" data-text={text} style={{ "--intensity": intensity } as React.CSSProperties} aria-hidden>
      {text}
    </span>
  );
}

function ParticleField({ show }: { show: boolean }) {
  const particles = Array.from({ length: 18 }).map((_, i) => {
    const size = 2 + Math.random() * 4;
    const x = Math.random() * 100;
    const y = 100 + Math.random() * 20;
    const duration = 6 + Math.random() * 4;
    const delay = Math.random() * 2;
    return (
      <motion.div
        key={i}
        className="pl__particle"
        style={{
          "--x": `${x}%`,
          "--y": `${y}%`,
          "--size": `${size}px`,
          "--dur": `${duration}s`,
          "--delay": `${delay}s`,
        } as React.CSSProperties}
        initial={{ opacity: 0, y: 0, scale: 0.5 }}
        animate={show ? { opacity: [0, 1, 0], y: [-120, 0, 120], scale: [0.5, 1, 0.5] } : { opacity: 0 }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      />
    );
  });

  return <div className="pl__particles" aria-hidden>{particles}</div>;
}

function CornerAccents({ show }: { show: boolean }) {
  const corners = [
    { top: 0, left: 0, r: 0 },
    { top: 0, right: 0, r: 90 },
    { bottom: 0, right: 0, r: 180 },
    { bottom: 0, left: 0, r: 270 },
  ];

  return (
    <>
      {corners.map((c, i) => {
        const { r, ...pos } = c;
        return (
          <motion.div
            key={i}
            className="pl__corner-accent"
            style={pos as React.CSSProperties}
            initial={{ opacity: 0, scale: 0.3, rotate: -45 }}
            animate={show ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.3, rotate: 45 }}
            transition={{ duration: 0.7, ease: easeSpring, delay: 0.2 + i * 0.08 }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M 4 20 L 4 4 L 20 4"
                stroke="#c8ff5e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: `rotate(${r}deg 14 14)` }}
              />
              <path
                d="M 6 18 L 6 6 L 18 6"
                stroke="rgba(200,255,94,0.3)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: `rotate(${r}deg 14 14)` }}
              />
            </svg>
          </motion.div>
        );
      })}
    </>
  );
}

function HexGrid({ show }: { show: boolean }) {
  const hexes = Array.from({ length: 12 }).map((_, i) => (
    <motion.div
      key={i}
      className="pl__hex"
      style={{
        "--i": i,
        "--delay": `${i * 0.06}s`,
      } as React.CSSProperties}
      initial={{ opacity: 0, scale: 0, rotate: Math.random() * 360 }}
      animate={show ? { opacity: [0, 0.15, 0], scale: [0, 1, 0], rotate: 180 } : { opacity: 0 }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
    >
      <svg width="100%" height="100%" viewBox="0 0 40 40">
        <polygon points="20,2 37.3,12 37.3,28 20,38 2.7,28 2.7,12" fill="none" stroke="#c8ff5e" strokeWidth="0.5" opacity="0.4" />
      </svg>
    </motion.div>
  ));

  return <div className="pl__hex-grid" aria-hidden>{hexes}</div>;
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const { identity } = useContent();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [lettersIn, setLettersIn] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const t1 = setTimeout(() => setLettersIn(true), 100);
    const t2 = setTimeout(() => setShowExtras(true), 350);

    const tick = (now: number) => {
      const p = Math.min(1, (now - startRef.current) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3.5);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setPhase("hold");
        setTimeout(() => setPhase("out"), 280);
      }
    };
    const raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const exitVariants = {
    topPanel: {
      initial: { y: 0, clipPath: "inset(0 0 0 0)" },
      exit: {
        y: "-100%",
        clipPath: "inset(0 0 100% 0)",
        transition: { duration: 1.1, ease: easeInOutQuart },
      },
    },
    bottomPanel: {
      initial: { y: 0, clipPath: "inset(0 0 0 0)" },
      exit: { y: "100%", clipPath: "inset(100% 0 0 0)", transition: { duration: 1.1, ease: easeInOutQuart } },
    },
    centerContent: {
      initial: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9, transition: { duration: 0.6, ease: easeInOutQuart, delay: 0.15 } },
    },
  };

  const isExiting = phase === "out";

  useEffect(() => {
    if (phase === "out") {
      const t = setTimeout(onDone, 1150);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  const [nameLine1, nameLine2] = identity.name.split(" ");
  const progress = count / 100;

  return (
    <div className="pl" role="status" aria-label="Loading portfolio">
      <div className="pl__bg-layer">
        <ParticleField show={!isExiting} />
        <HexGrid show={!isExiting} />
      </div>

      <motion.div className="pl__orbits-layer" initial="initial" animate={isExiting ? "exit" : "initial"} variants={exitVariants.centerContent}>
        <OrbitSystem show={!isExiting} />
      </motion.div>

      <CornerAccents show={!isExiting} />

      <ScanLine show={!isExiting} />

      <motion.div
        className="pl__panel pl__panel--top"
        variants={exitVariants.topPanel}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
      >
        <GridField show={!isExiting} />

        <div className="pl__name-wrap">
          <div className="pl__name-line">
            <Letters text={nameLine1} show={lettersIn && !isExiting} className="pl__name-main" />
          </div>
          <div className="pl__name-line pl__name-line--offset">
            <Letters text={nameLine2} show={lettersIn && !isExiting} className="pl__name-outline" />
          </div>
        </div>

        <AnimatePresence>
          {showExtras && !isExiting && (
            <motion.div
              className="pl__role-tag"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.6, ease: easeSpring, delay: 0.1 }}
            >
              <span className="mono">{identity.role}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pl__accent-line" />
      </motion.div>

      <motion.div
        className="pl__panel pl__panel--bottom"
        variants={exitVariants.bottomPanel}
        initial="initial"
        animate={isExiting ? "exit" : "initial"}
      >
        <motion.div
          className="pl__center-content"
          variants={exitVariants.centerContent}
          initial="initial"
          animate={isExiting ? "exit" : "initial"}
        >
          <div className="pl__meter">
            <ProgressRing progress={progress} />
            <span className="pl__count" aria-hidden>
              {String(count).padStart(2, "0")}
            </span>
          </div>

          <AnimatePresence>
            {showExtras && !isExiting && (
              <motion.div
                className="pl__status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
              >
                <motion.span
                  className="pl__status-dot"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
                <GlitchText
                  text={
                    count < 35
                      ? "INITIALISING NEURAL PATHWAYS"
                      : count < 65
                        ? "LOADING CREATIVE ASSETS"
                        : count < 90
                          ? "RENDERING PORTFOLIO"
                          : "SYNCHRONISING"
                  }
                  intensity={count < 35 ? 0.5 : count < 65 ? 0.8 : 1.2}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pl__bottom-info">
            <span className="mono pl__copy">{`${new Date().getFullYear()} — PORTFOLIO v2.0`}</span>
            <div className="pl__progress-bar" aria-hidden>
              <motion.div
                className="pl__progress-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.08, ease: "linear" }}
                style={{ transformOrigin: "left center" }}
              />
            </div>
          </div>
        </motion.div>

        <div className="pl__accent-line pl__accent-line--bottom" />
      </motion.div>
    </div>
  );
}