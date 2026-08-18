import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Reveal } from "./Reveal";
import { useContent } from "../lib/content";

export function Timeline() {
  const { experience } = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <section id="experience" ref={ref} className="section path">
      <div className="container">
        <Reveal>
          <span className="eyebrow">04 — The path</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="path__heading display">
            My <span className="serif grad-text">journey</span> so far.
          </h2>
        </Reveal>

        <div className="path__track">
          <div className="path__line">
            <motion.div className="path__line-fill" style={{ scaleY }} />
          </div>

          <ul className="path__entries">
            {experience.map((e, i) => (
              <li key={e.period + e.role} className="path__entry">
                <motion.span
                  className="path__node"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  aria-hidden
                />
                <Reveal delay={0.05 * i} amount={0.4}>
                  <div className="path__entry-inner">
                    <span className="path__period mono">{e.period}</span>
                    <h3 className="path__role display">
                      {e.role} <span className="serif">/ {e.company}</span>
                    </h3>
                    <span className="path__place mono">{e.place}</span>
                    <ul className="path__bullets">
                      {e.note
                        .split("\n")
                        .filter((line) => line.trim().length > 0)
                        .map((line, li) => (
                          <li key={li} className="path__note">{line}</li>
                        ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
