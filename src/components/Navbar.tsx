import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { scrollTo } from "../lib/smoothScroll";
import { useActiveSection } from "../lib/hooks";
import { useContent } from "../lib/content";

const LINKS: { id: string; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Path" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const { identity } = useContent();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  const active = useActiveSection(LINKS.map((l) => l.id));

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 300);
  });

  useEffect(() => {
    document.body.style.cursor = "";
  }, []);

  return (
    <motion.header
      className="nav"
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      data-scrolled={scrolled}
    >
      <div className="nav__inner glass">
        <button
          className="nav__logo"
          onClick={() => scrollTo("#home")}
          data-cursor="hover"
        >
          <span className="nav__logo-mark" />
          <span>{identity.navName}</span>
        </button>

        <nav className="nav__links">
          {LINKS.map((l) => (
            <button
              key={l.id}
              className="nav__link"
              data-active={active === l.id}
              onClick={() => scrollTo(`#${l.id}`)}
              data-cursor="hover"
            >
              <span className="nav__link-index">
                0{LINKS.findIndex((x) => x.id === l.id) + 1}
              </span>
              <span>{l.label}</span>
              {active === l.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="nav__link-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </nav>

        <button className="btn btn--ghost nav__cta" onClick={() => scrollTo("#contact")} data-cursor="hover">
          <span className="btn__fill" />
          Let’s talk
        </button>

        <div className="nav__progress">
          <motion.div className="nav__progress-fill" style={{ scaleX: progress }} />
        </div>
      </div>
    </motion.header>
  );
}
