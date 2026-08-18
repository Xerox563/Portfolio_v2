import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Project } from "../lib/content";
import { getLenis } from "../lib/smoothScroll";
import { PreviewShape } from "./PreviewShape";
import { ModalPortal } from "./ModalPortal";

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [onClose]);

  return (
    <ModalPortal>
      <motion.div
        className="project-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} details`}
      >
        <motion.div
          className="project-modal__panel glass"
          initial={{ y: 56, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="project-modal__close"
            onClick={onClose}
            data-cursor="hover"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 4L14 14M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div
            className="project-modal__art"
            style={{ background: project.palette }}
          >
            <PreviewShape shape={project.shape} />
            <span className="project-modal__art-index display">
              {project.index}
            </span>
          </div>

          <div className="project-modal__body">
            <span className="eyebrow">
              {project.client} — {project.year}
            </span>
            <h3 className="project-modal__title display">{project.title}</h3>

            {project.tags.length > 0 && (
              <div className="project-modal__tags">
                {project.tags.map((t) => (
                  <span key={t} className="work__row-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {project.description && (
              <p className="project-modal__desc">{project.description}</p>
            )}

            {project.tech.length > 0 && (
              <div className="project-modal__tech">
                <span className="project-modal__label mono">Tech stack</span>
                <div className="project-modal__chips">
                  {project.tech.map((t) => (
                    <span key={t} className="project-modal__chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(project.github || project.deployed) && (
              <div className="project-modal__links">
                {project.github && (
                  <a
                    className="btn"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                  >
                    <span className="btn__fill" />
                    View code
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 3H3V13H13V10M9 7L13 3M13 3H10M13 3V6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
                {project.deployed && (
                  <a
                    className="btn btn--ghost"
                    href={project.deployed}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                  >
                    <span className="btn__fill" />
                    Live site
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 3H3V13H13V10M9 7L13 3M13 3H10M13 3V6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
}
