import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "../lib/content";

export function Footer() {
  const { identity } = useContent();
  const [time, setTime] = useState(() => formatNow(identity.timezone));

  useEffect(() => {
    const id = setInterval(() => setTime(formatNow(identity.timezone)), 1000);
    return () => clearInterval(id);
  }, [identity.timezone]);

  const wordmark = identity.footerWordmark;

  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__cta">
          <span className="mono">Let’s talk</span>
          <a href={`mailto:${identity.email}`} className="footer__email link-underline" data-cursor="hover">
            {identity.email}
          </a>
        </div>
        <div className="footer__meta">
          <span className="footer__time mono">{identity.city} — {time}</span>
          <span className="footer__status status">
            <span className="status__dot" /> Available
          </span>
        </div>
      </div>

      <div
        className={`footer__wordmark ${wordmark.length > 7 ? "footer__wordmark--long" : ""}`}
        aria-hidden
      >
        {wordmark.split("").map((c, i) => (
          <motion.span
            key={i}
            initial={{ y: "60%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="footer__char"
          >
            {c}
          </motion.span>
        ))}
      </div>

      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} {identity.name} — Portfolio.</span>
        <nav className="footer__nav">
          <a href="#home" className="link-underline" data-cursor="hover">Top</a>
          <a href="#work" className="link-underline" data-cursor="hover">Work</a>
          <a href="#contact" className="link-underline" data-cursor="hover">Contact</a>
        </nav>
        <span className="footer__credits">Built with React, Framer Motion & Lenis.</span>
      </div>
    </footer>
  );
}

function formatNow(timeZone: string) {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
}