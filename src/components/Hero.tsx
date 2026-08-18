import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Magnetic } from "./Magnetic";
import { scrollTo } from "../lib/smoothScroll";
import { useContent } from "../lib/content";

export function Hero() {
  const { identity } = useContent();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [0, 12]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  // mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // parallax intensity per blob layer
  const b1x = useTransform(smx, (v) => v * -120);
  const b1y = useTransform(smy, (v) => v * -80);
  const b2x = useTransform(smx, (v) => v * 90);
  const b2y = useTransform(smy, (v) => v * 70);
  const b3x = useTransform(smx, (v) => v * 160);
  const b3y = useTransform(smy, (v) => v * -120);
  const gridX = useTransform(smx, (v) => v * -24);
  const gridY = useTransform(smy, (v) => v * -16);

  return (
    <section id="home" ref={heroRef} className="hero">
      {/* backdrop layers */}
      <div className="hero__bg" aria-hidden>
        <motion.div className="hero__grid" style={{ x: gridX, y: gridY }} />
        <motion.div
          className="blob hero__blob hero__blob-1"
          style={{ x: b1x, y: b1y, background: "#c8ff5e" }}
        />
        <motion.div
          className="blob hero__blob hero__blob-2"
          style={{ x: b2x, y: b2y, background: "#5ec8ff" }}
        />
        <motion.div
          className="blob hero__blob hero__blob-3"
          style={{ x: b3x, y: b3y, background: "#ff5ea0" }}
        />
        <motion.div
          className="blob hero__blob hero__blob-4"
          style={{ x: b2x, y: b3y, background: "#9b7bff" }}
        />
        <div className="hero__vignette" />
      </div>

      {/* meta corners */}
      <motion.div className="hero__meta hero__meta--tl" style={{ opacity: fade }}>
        <span className="eyebrow">Portfolio — v04</span>
      </motion.div>
      <motion.div className="hero__meta hero__meta--tr" style={{ opacity: fade }}>
        <Clock />
      </motion.div>
      <motion.div className="hero__meta hero__meta--bl" style={{ opacity: fade }}>
        <span className="mono">{identity.location}</span>
      </motion.div>
      <motion.div className="hero__meta hero__meta--br" style={{ opacity: fade }}>
        <span className="status">
          <span className="status__dot" /> {identity.availability}
        </span>
      </motion.div>

      {/* center */}
      <motion.div
        className="hero__content container"
        style={{ y: titleY, opacity: fade, filter }}
      >
        <motion.p
          className="hero__role"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {identity.role.split(" / ")[0]}
          <span className="serif" style={{ color: "var(--accent)" }}>/</span>
          {identity.role.split(" / ")[1] ?? ""}
        </motion.p>

        <h1
          className={`hero__name display ${identity.heroWordmark.length > 6 ? "hero__name--long" : ""}`}
          aria-label={identity.name}
        >
          {identity.heroWordmark.split("").map((ch, i) => (
            <span className="hero__char" key={i} aria-hidden>
              <motion.span
                className="hero__char-inner"
                initial={{ y: "110%", opacity: 0, rotateX: -90 }}
                animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                transition={{
                  delay: 0.25 + i * 0.07,
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero__lede"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {identity.taglineHighlight &&
          identity.tagline.includes(identity.taglineHighlight) ? (
            <>
              {identity.tagline.split(identity.taglineHighlight)[0]}
              <span className="serif grad-text">&nbsp;{identity.taglineHighlight}</span>
              {identity.tagline.split(identity.taglineHighlight)[1] ?? ""}
            </>
          ) : (
            identity.tagline
          )}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic strength={0.35}>
            <button className="btn" onClick={() => scrollTo("#work")} data-cursor="hover">
              <span className="btn__fill" />
              View selected work
              <Arrow />
            </button>
          </Magnetic>
          <Magnetic strength={0.35}>
            <button
              className="btn btn--ghost"
              onClick={() => scrollTo("#contact")}
              data-cursor="hover"
            >
              <span className="btn__fill" />
              Start a project
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        className="hero__scroll"
        style={{ opacity: fade }}
        onClick={() => scrollTo("#about")}
        data-cursor="hover"
      >
        <span className="mono">Scroll</span>
        <span className="hero__scroll-track">
          <motion.span
            className="hero__scroll-dot"
            animate={{ y: [0, 28, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8H13M13 8L8 3M13 8L8 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Clock() {
  const { identity } = useContent();
  const [time, setTime] = useState(() => formatNow(identity.timezone));
  useEffect(() => {
    const id = setInterval(() => setTime(formatNow(identity.timezone)), 1000);
    return () => clearInterval(id);
  }, [identity.timezone]);
  return <span className="mono">{time}</span>;
}

function formatNow(timeZone: string) {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
  });
}
