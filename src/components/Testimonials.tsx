import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";
import { useContent, initialsOf } from "../lib/content";

const ACCENTS = ["#c8ff5e", "#5ec8ff", "#ff5ea0", "#9b7bff"];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const { testimonials } = useContent();
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
        {testimonials.map((q, i) => (
          <figure className="testimonials__card glass" key={q.name} data-cursor="hover">
            <blockquote className="testimonials__quote serif">“{q.text}”</blockquote>
            <figcaption className="testimonials__author">
              <span className="testimonials__avatar" style={{ background: ACCENTS[i % ACCENTS.length] }}>
                {initialsOf(q.name).replace("·", "")}
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
