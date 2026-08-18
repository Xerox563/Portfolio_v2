import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { Highlight } from "./Highlight";
import { initialsOf, useContent } from "../lib/content";

export function About() {
  const { identity, about } = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const stampRotate = useTransform(scrollYProgress, [0, 1], [0, 240]);

  return (
    <section id="about" ref={ref} className="section about">
      <div className="container about__grid">
        {/* left: narrative */}
        <div className="about__copy">
          <Reveal>
            <span className="eyebrow">01 — About</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="about__heading display">
              <Highlight text={about.heading} words={2} />
            </h2>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.12 + i * 0.06}>
              <p className="about__body">{p}</p>
            </Reveal>
          ))}

          <Reveal delay={0.22}>
            <ul className="about__stack">
              {about.chips.map((s) => (
                <li key={s} className="about__chip" data-cursor="hover">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="about__stats">
            {about.stats.map((s, i) => (
              <Reveal key={s.label} delay={0.05 * i}>
                <div className="about__stat">
                  <div className="about__stat-value display">{s.value}</div>
                  <div className="about__stat-label">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* right: parallax portrait card */}
        <Reveal direction="right" className="about__visual-wrap">
          <motion.div className="about__visual" style={{ y: portraitY }}>
            <div className="about__visual-frame glass" data-cursor="view">
              <div className="about__visual-glow" />
              {identity.portrait ? (
                <img
                  className="about__visual-img"
                  src={identity.portrait}
                  alt={identity.name}
                  draggable={false}
                />
              ) : (
                <div className="about__visual-initials display">
                  {initialsOf(identity.name)}
                </div>
              )}
              <div className="about__visual-grid" />
              <div className="about__visual-meta">
                <span className="mono">{identity.portraitCaption}</span>
              </div>
            </div>

            <motion.div
              className="about__stamp"
              style={{ rotate: stampRotate }}
              aria-hidden
            >
              <svg viewBox="0 0 120 120" width="120" height="120">
                <defs>
                  <path id="circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text className="about__stamp-text">
                  <textPath href="#circle">
                    {identity.stampText}
                  </textPath>
                </text>
                <circle cx="60" cy="60" r="6" fill="var(--accent)" />
              </svg>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}