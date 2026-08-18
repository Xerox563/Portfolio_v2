import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { PreviewShape } from "./PreviewShape";
import { BlogModal } from "./BlogModal";
import { getBlogs, likeBlog, type Blog } from "../lib/api";
import { formatDate } from "../lib/format";

const LIKES_KEY = "amit-blog-likes-v1";

function loadLiked(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveLiked(set: Set<string>) {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<Blog | null>(null);
  const [liked, setLiked] = useState<Set<string>>(() => loadLiked());

  useEffect(() => {
    getBlogs().then((b) => {
      if (b) setBlogs(b);
      else setBlogs([]);
    });
  }, []);

  const visible = showAll ? (blogs ?? []) : (blogs ?? []).slice(0, 6);
  const canExpand = (blogs?.length ?? 0) > 6;

  const toggleLike = async (blog: Blog) => {
    const isLiked = liked.has(blog.id);
    const next = new Set(liked);
    if (isLiked) next.delete(blog.id);
    else next.add(blog.id);
    setLiked(next);
    saveLiked(next);

    const optimistic = (delta: number) =>
      setBlogs((prev) =>
        prev ? prev.map((b) => (b.id === blog.id ? { ...b, likes: Math.max(0, b.likes + delta) } : b)) : prev
      );
    optimistic(isLiked ? -1 : 1);

    const serverLikes = await likeBlog(blog.id, !isLiked);
    if (serverLikes === null) {
      optimistic(isLiked ? 1 : -1);
      const rollback = new Set(liked);
      if (isLiked) rollback.add(blog.id);
      else rollback.delete(blog.id);
      setLiked(rollback);
      saveLiked(rollback);
    } else {
      setBlogs((prev) =>
        prev ? prev.map((b) => (b.id === blog.id ? { ...b, likes: serverLikes } : b)) : prev
      );
    }
  };

  return (
    <section id="blog" className="section blog">
      <div className="container">
        <Reveal>
          <span className="eyebrow">06 — Journal</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="blog__heading display">
            Notes from the <span className="serif grad-text">workbench</span>.
          </h2>
        </Reveal>

        {blogs === null ? (
          <div className="blog__loading">
            <span className="status">
              <span className="status__dot" /> Reading the journal…
            </span>
          </div>
        ) : blogs.length === 0 ? (
          <Reveal>
            <div className="blog__empty glass">
              <p className="serif">No notes yet — check back soon.</p>
              <span className="mono">blogs.db is empty</span>
            </div>
          </Reveal>
        ) : (
          <>
            <motion.div
              className="blog__grid"
              layout
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence mode="popLayout">
                {visible.map((b, i) => (
                  <motion.div
                    key={b.id}
                    layout
                    initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <BlogCard
                      blog={b}
                      liked={liked.has(b.id)}
                      onOpen={() => setOpen(b)}
                      onLike={() => toggleLike(b)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {canExpand && (
              <Reveal delay={0.1}>
                <div className="blog__more">
                  <button
                    className="btn btn--ghost"
                    onClick={() => setShowAll((v) => !v)}
                    data-cursor="hover"
                  >
                    <span className="btn__fill" />
                    {showAll ? "Show less" : "View all"}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d={showAll ? "M3 12L8 7L13 12" : "M3 4L8 9L13 4"}
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span className="blog__more-count mono">
                    {blogs.length} notes in the journal
                  </span>
                </div>
              </Reveal>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <BlogModal
            blog={open}
            liked={liked.has(open.id)}
            onClose={() => setOpen(null)}
            onLike={() => toggleLike(open)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function BlogCard({
  blog,
  liked,
  onOpen,
  onLike,
}: {
  blog: Blog;
  liked: boolean;
  onOpen: () => void;
  onLike: () => void;
}) {
  const onKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      className="blog__card glass"
      data-cursor="view"
      onClick={onOpen}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      aria-label={`Read ${blog.title}`}
    >
      <div className="blog__card-art" style={{ background: blog.palette }}>
        <PreviewShape shape={blog.shape} />
        <span className="blog__card-art-grid" aria-hidden />
        {blog.tags.length > 0 && (
          <span className="blog__card-art-tag mono">{blog.tags[0]}</span>
        )}
      </div>
      <div className="blog__card-body">
        <h3 className="blog__card-title display">{blog.title}</h3>
        <p className="blog__card-excerpt">{blog.excerpt}</p>
        <div className="blog__card-foot">
          <span className="mono blog__card-meta">
            {formatDate(blog.createdAt)} · {blog.readTime} min read
          </span>
          <button
            className={`blog__like ${liked ? "blog__like--on" : ""}`}
            data-cursor="hover"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <motion.span
              key={String(liked)}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="blog__like-heart"
            >
              {liked ? "♥" : "♡"}
            </motion.span>
            <span className="mono">{blog.likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}