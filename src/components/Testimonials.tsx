import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";

interface Quote {
  text: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
}

const QUOTES: Quote[] = [
  {
    text: "Aurora treats motion as a language, not decoration. The launch felt like a film — and conversions doubled the previous record.",
    name: "Mira Velez",
    role: "CD, Atmosphere Studio",
    initials: "MV",
    accent: "#c8ff5e",
  },
  {
    text: "Rarest combination I’ve worked with: a true designer who ships production-grade React. Our design system stopped being aspirational.",
    name: "Jonas Brandt",
    role: "VP Product, Helio Robotics",
    initials: "JB",
    accent: "#5ec8ff",
  },
  {
    text: "We briefed a microsite. We got a piece of the internet people keep sending back to us.",
    name: "Itsuki Mori",
    role: "Label lead, Lyra Records",
    initials: "IM",
    accent: "#ff5ea0",
  },
  {
    text: "Performance scores stayed green on a full-bleed WebGL launch. I still don't know how. Worth every minute.",
    name: "Dani Costa",
    role: "Founder, Ayru Labs",
    initials: "DC",
    accent: "#9b7bff",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-22%"]);

  return (
    <section ref={ref} className="section testimonials">
      <div className="container">
        <Reveal>
          <span className="eyebrow">05 — Kind words</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="testimonials__heading display">
            From the people who <span className="serif grad-text">shipped</span> beside me.
          </h2>
        </Reveal>
      </div>

      <motion.div className="testimonials__track" style={{ x }}>
        {QUOTES.map((q) => (
          <figure className="testimonials__card glass" key={q.name} data-cursor="hover">
            <blockquote className="testimonials__quote serif">“{q.text}”</blockquote>
            <figcaption className="testimonials__author">
              <span className="testimonials__avatar" style={{ background: q.accent }}>
                {q.initials}
              </span>
              <span>
                <span className="testimonials__name">{q.name}</span>
                <span className="testimonials__role">{q.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
        <div className="testimonials__spacer" aria-hidden />
      </motion.div>
    </section>
  );
}
