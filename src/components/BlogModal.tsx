import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Blog } from "../lib/api";
import { getLenis } from "../lib/smoothScroll";
import { PreviewShape } from "./PreviewShape";
import { formatDate } from "../lib/format";

export function BlogModal({
  blog,
  liked,
  onClose,
  onLike,
}: {
  blog: Blog;
  liked: boolean;
  onClose: () => void;
  onLike: () => void;
}) {
  const [heart, setHeart] = useState(false);

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

  const paragraphs = blog.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const handleLike = () => {
    setHeart(true);
    setTimeout(() => setHeart(false), 500);
    onLike();
  };

  return (
    <motion.div
      className="blog-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={blog.title}
    >
      <motion.article
        className="blog-modal__panel glass"
        initial={{ y: 56, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="blog-modal__close" onClick={onClose} data-cursor="hover" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="blog-modal__art" style={{ background: blog.palette }}>
          <PreviewShape shape={blog.shape} />
          <div className="blog-modal__art-grid" aria-hidden />
          {blog.tags.length > 0 && (
            <div className="blog-modal__tags">
              {blog.tags.map((t) => (
                <span key={t} className="blog-modal__tag mono">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="blog-modal__body">
          <header className="blog-modal__head">
            <span className="mono blog-modal__meta">
              {formatDate(blog.createdAt)} · {blog.readTime} min read
            </span>
            <h1 className="blog-modal__title display">{blog.title}</h1>
            <p className="blog-modal__excerpt serif">{blog.excerpt}</p>
          </header>

          <div className="blog-modal__content">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <footer className="blog-modal__foot">
            <div className="blog-modal__foot-divider" />
            <button className="blog-modal__like-btn" onClick={handleLike} data-cursor="hover">
              <motion.span
                className="blog-modal__heart"
                animate={heart ? { scale: [1, 1.6, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                data-on={liked}
              >
                {liked ? "♥" : "♡"}
              </motion.span>
              <span className="blog-modal__like-label">
                {liked ? "Liked" : "Like this note"}
              </span>
              <span className="mono blog-modal__like-count">{blog.likes}</span>
            </button>
          </footer>
        </div>
      </motion.article>
    </motion.div>
  );
}