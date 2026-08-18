import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Reveal } from "./Reveal";
import { scrollTo } from "../lib/smoothScroll";
import type { Project } from "../lib/content";
import { useContent } from "../lib/content";
import { PreviewShape } from "./PreviewShape";
import { ProjectModal } from "./ProjectModal";

export function Projects() {
  const { projects } = useContent();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const [hoveredAny, setHoveredAny] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section
      id="work"
      ref={ref}
      className="section work"
      onMouseMove={onMove}
      onMouseEnter={() => setHoveredAny(true)}
      onMouseLeave={() => {
        setHoveredAny(false);
        setActive(null);
      }}
    >
      <div className="container">
        <div className="work__head">
          <Reveal>
            <span className="eyebrow">03 — Selected work</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="work__heading display">
              Work that <span className="serif grad-text">moved</span> people,
              <br />and the metrics.
            </h2>
          </Reveal>
        </div>

        <div className="work__list-wrap">
          <ul className="work__list">
            {projects.map((p, i) => (
              <Reveal key={p.id} direction="left" delay={i * 0.04} amount={0.2}>
                <ProjectRow
                  project={p}
                  onHover={() => setActive(i)}
                  onLeave={() => setActive(null)}
                  onOpen={() => setOpen(p)}
                  active={active === i}
                />
              </Reveal>
            ))}
          </ul>

          {/* floating preview that follows the cursor */}
          <motion.div
            className="work__preview"
            style={{ x: sx, y: sy }}
            data-visible={hoveredAny && active !== null}
          >
            {projects.map((p, i) => (
              <ProjectPreview key={p.id} project={p} show={active === i} />
            ))}
          </motion.div>
        </div>

        <Reveal delay={0.1}>
          <div className="work__footer">
            <button
              className="btn btn--ghost work__more"
              onClick={() => scrollTo("#contact")}
              data-cursor="hover"
            >
              <span className="btn__fill" />
              Request the full case studies
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectRow({
  project,
  onHover,
  onLeave,
  onOpen,
  active,
}: {
  project: Project;
  onHover: () => void;
  onLeave: () => void;
  onOpen: () => void;
  active: boolean;
}) {
  const onKey = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <li
      className="work__row"
      data-cursor="view"
      data-active={active}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onOpen}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title} details`}
    >
      <span className="work__row-index mono">{project.index}</span>
      <span className="work__row-title display">{project.title}</span>
      <span className="work__row-tags">
        {project.tags.map((t) => (
          <span key={t} className="work__row-tag">{t}</span>
        ))}
      </span>
      <span className="work__row-meta">
        <span>{project.client}</span>
        <span className="work__row-year">{project.year}</span>
      </span>
      <span className="work__row-arrow" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M5 11H17M17 11L11 5M17 11L11 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </li>
  );
}

function ProjectPreview({ project, show }: { project: Project; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="work__preview-card"
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="work__preview-art" style={{ background: project.palette }}>
            <PreviewShape shape={project.shape} />
          </div>
          <div className="work__preview-label">
            <span className="mono">{project.client}</span>
            <span className="serif">{project.title}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}