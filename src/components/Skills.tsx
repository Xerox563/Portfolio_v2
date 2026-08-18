import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Reveal } from "./Reveal";
import { Highlight } from "./Highlight";
import type { SkillGroup } from "../lib/content";
import { useContent } from "../lib/content";

export function Skills() {
  const { skills } = useContent();
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <Reveal>
          <span className="eyebrow">02 — Skills</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="skills__heading display">
            <Highlight text={skills.heading} words={1} />
          </h2>
        </Reveal>

        <div className="skills__grid">
          {skills.groups.map((g, gi) => (
            <Reveal key={g.title} delay={0.1 * gi}>
              <SkillCard group={g} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ group }: { group: SkillGroup }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 200, damping: 25 });
  const smy = useSpring(my, { stiffness: 200, damping: 25 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      className="skills__card glass"
      onMouseMove={onMove}
      onHoverStart={() => setHovered(0)}
      onHoverEnd={() => setHovered(null)}
    >
      <motion.div
        className="skills__glow"
        style={{
          x: smx,
          y: smy,
          opacity: hovered !== null ? 1 : 0,
        }}
        aria-hidden
      />
      <div className="skills__card-head">
        <span className="skills__card-index">{group.title.charAt(0)}</span>
        <h3 className="skills__card-title">{group.title}</h3>
      </div>
      <ul className="skills__list">
        {group.items.map((it, i) => (
          <li
            key={it.name}
            className="skills__item"
            data-cursor="hover"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="skills__item-name" data-hover={hovered === i}>
              {it.name}
            </span>
            <motion.span
              className="skills__item-note"
              initial={false}
              animate={{
                height: hovered === i ? "auto" : 0,
                opacity: hovered === i ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="skills__item-note-inner">{it.note}</span>
            </motion.span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
