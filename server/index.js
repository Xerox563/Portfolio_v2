import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DB_FILE = path.join(ROOT, "db.json");
const BLOGS_FILE = path.join(ROOT, "blogs.db");
const DIST_DIR = path.join(ROOT, "dist");
const PORT = process.env.PORT || 3001;

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

const SEED_BLOGS = [
  {
    id: "portfolio-that-feels-alive",
    title: "Building a Portfolio That Feels Alive",
    excerpt:
      "Motion isn't decoration — it's the difference between a page and a place. Here's how I approach animated, performance-first portfolios.",
    content: `When someone lands on your portfolio they make a judgment in under a second. Not about your taste in colors — about whether you care. Motion is the fastest way to communicate that you care about the experience, not just the output.

The trick is restraint. Every animation should have a reason: guiding the eye, confirming an action, or rewarding a scroll. If a transition doesn't answer a question the visitor just asked, cut it.

Performance is non-negotiable. I keep animations transform-and-opacity only, use scroll-driven values instead of JavaScript timers, and respect prefers-reduced-motion at every level. A portfolio that stutters undermines everything it tries to say.

The result feels less like a document and more like a room you walk through. That's the goal — pages are read, places are visited.`,
    tags: ["design", "motion", "frontend"],
    palette: "linear-gradient(135deg,#c8ff5e,#5ec8ff)",
    shape: "wave",
    readTime: 4,
    likes: 42,
    createdAt: "2026-07-02T10:00:00.000Z",
    updatedAt: "2026-07-02T10:00:00.000Z",
  },
  {
    id: "why-typescript-every-time",
    title: "Why I Reach for TypeScript Every Time",
    excerpt:
      "Types aren't paperwork. They're a design tool that catches the mistakes you didn't know you were making.",
    content: `I used to think types slowed me down. Then I shipped a refactor that touched forty files and the compiler found the three places I would have broken. That's the moment TypeScript stopped being a tax and started being a colleague.

The real payoff isn't autocomplete — it's courage. When every boundary of your system is declared, you can change large pieces with confidence. You refactor more, so your codebase stays young.

Types also read as documentation. A well-named interface tells the next developer more than a paragraph of comments. The types are the truth; the implementation is just details.

Start small if you have to: add types where it hurts most, then widen. The goal isn't 100% coverage, it's 100% honesty at the edges where systems meet.`,
    tags: ["typescript", "engineering"],
    palette: "linear-gradient(135deg,#ff5ea0,#9b7bff)",
    shape: "grid",
    readTime: 3,
    likes: 37,
    createdAt: "2026-06-18T09:00:00.000Z",
    updatedAt: "2026-06-18T09:00:00.000Z",
  },
  {
    id: "art-of-the-loading-state",
    title: "The Art of the Loading State",
    excerpt:
      "Waiting is a feeling. Design the in-between moments and your product feels twice as fast.",
    content: `Every request your app makes is a story with three beats: it starts, it resolves, or it fails. Most products only design the happy ending — then wonder why users complain about speed.

The perception of speed is designable. A skeleton that mirrors the final layout feels instant compared to a spinner, because your brain starts reading the page before the data arrives. Optimistic updates feel like magic because the app answers before the server does.

But the most important state is the failure state. A polite, specific error — with a retry button — turns a dead end into a conversation. Error messages are UX, not afterthoughts.

Nothing you ship will be as fast as your ambition. What you can control is how gracefully the gap is filled. That's where craft lives.`,
    tags: ["ux", "performance"],
    palette: "linear-gradient(135deg,#5ec8ff,#9b7bff)",
    shape: "aura",
    readTime: 3,
    likes: 29,
    createdAt: "2026-05-27T14:30:00.000Z",
    updatedAt: "2026-05-27T14:30:00.000Z",
  },
  {
    id: "react-server-components-simply",
    title: "React Server Components, Explained Simply",
    excerpt:
      "The mental model that finally made RSC click — and why it changes where your code runs.",
    content: `For years React had one job: render things in the browser. Server Components quietly flip the script — some of your components run on the server, once, and only their output ships to the client.

The win is bundle size. Server components don't send their JavaScript at all. Libraries that used to cost 200kb of client code can live entirely on the server, and the browser never knows.

The rule of thumb is simple: server components for anything that reads data, client components for anything interactive, and you compose them freely. A server component can render a client component, and the boundary is explicit in the file extension.

The mental shift is treating your React tree as a mix of server and client islands instead of one client-only app. Once it clicks, you start asking a better question — not "where does this render?" but "who needs this data, and who needs this code?".`,
    tags: ["react", "architecture"],
    palette: "linear-gradient(135deg,#c8ff5e,#ff5ea0)",
    shape: "ring",
    readTime: 5,
    likes: 51,
    createdAt: "2026-05-12T08:00:00.000Z",
    updatedAt: "2026-05-12T08:00:00.000Z",
  },
  {
    id: "css-is-a-language-now",
    title: "CSS Is a Programming Language Now",
    excerpt:
      "Cascade layers, container queries, nesting. The CSS I learned in 2015 is unrecognizable — in the best way.",
    content: `CSS used to be the part of the job you tolerated. Today it's a full language with real engineering muscle: nesting, cascade layers, container queries, and a color syntax that finally makes sense.

Container queries are the sleeper hit. Components can now respond to their own container instead of the viewport — the same card component behaves differently in a sidebar and a hero. That's the encapsulation CSS always needed.

Cascade layers replace the specificity arms race. You declare your layers once — reset, tokens, components, utilities — and the order of your file stops being a coin flip. No more !important to win a war nobody wanted.

If you haven't looked at CSS in two years, look again. It's not the same language. It's the language the web was always meant to have.`,
    tags: ["css", "frontend"],
    palette: "linear-gradient(135deg,#9b7bff,#ff5ea0)",
    shape: "wave",
    readTime: 4,
    likes: 33,
    createdAt: "2026-04-21T16:45:00.000Z",
    updatedAt: "2026-04-21T16:45:00.000Z",
  },
  {
    id: "small-honest-mvps",
    title: "Shipping Faster With Small, Honest MVPs",
    excerpt:
      "The fastest way to ship is to build less — but the art is choosing what to leave out without lying.",
    content: `Every project starts with a beautiful roadmap and ends with a backlog of promises. The projects that actually ship do one thing genuinely well and let everything else be honest scaffolding.

An MVP is not a bad version of your final product. It's the smallest version of your product that proves the core question: does anyone want this? If the core doesn't work, a beautiful edge case won't save you.

The discipline is in the cut list. Features that are easy to add later can wait. Features that change how the product feels cannot. I keep a "later" list visible and celebrated — cutting a feature isn't failure, it's focus.

Speed is a feature users feel immediately. A small, honest thing shipped this week beats a grand thing shipped next quarter — every time.`,
    tags: ["product", "mindset"],
    palette: "linear-gradient(135deg,#5ec8ff,#c8ff5e)",
    shape: "grid",
    readTime: 4,
    likes: 26,
    createdAt: "2026-04-03T11:20:00.000Z",
    updatedAt: "2026-04-03T11:20:00.000Z",
  },
  {
    id: "favorite-dev-tools-2026",
    title: "My Favorite Dev Tools in 2026",
    excerpt:
      "The short list of tools that earn their place in my daily workflow — and the one rule for choosing them.",
    content: `Tooling is a rabbit hole with a happy exit: the tools you forget you're using. Here's the short list that earned its place this year.

Editor: whatever makes you fastest, tuned once and never fussed with again. My config is years old and I still discover one shortcut a month. Terminal: fast, scriptable, and quiet. My whole setup runs from dotfiles that are versioned like code.

The rest of the stack changes, but the rule stays: a tool must either save time every day or unlock something impossible without it. If a tool needs learning twice, it's not a tool — it's a hobby.

The best tool decision I made this year was uninstalling three tools I'd stopped using. Maintenance is also a cost.`,
    tags: ["tooling", "workflow"],
    palette: "linear-gradient(135deg,#ff5ea0,#5ec8ff)",
    shape: "aura",
    readTime: 3,
    likes: 44,
    createdAt: "2026-03-14T09:15:00.000Z",
    updatedAt: "2026-03-14T09:15:00.000Z",
  },
  {
    id: "designing-for-reduced-motion",
    title: "Designing for Reduced Motion",
    excerpt:
      "Motion sickness isn't a niche problem. Making your animations optional makes your product better for everyone.",
    content: `About a third of users have some preference for reduced motion — and that's before you count vestibular disorders, ADHD, or simply people working in noisy environments where a spinning loader is pure torture.

The web platform solved the hard part years ago: prefers-reduced-motion is one media query, and every major browser supports it. The design work is deciding what to do with it.

The approach that works: motion becomes a layer, not a texture. Core interactions — showing, hiding, focus — always work, in a single clean frame. The decorative choreography fades to instant. Scrolling feels controlled, not cinematic.

Reduced motion users aren't asking for a worse experience. They're asking for the same experience without the discomfort. Design that treats that as a first-class constraint is just better design.`,
    tags: ["accessibility", "motion"],
    palette: "linear-gradient(135deg,#9b7bff,#5ec8ff)",
    shape: "ring",
    readTime: 4,
    likes: 31,
    createdAt: "2026-02-19T13:00:00.000Z",
    updatedAt: "2026-02-19T13:00:00.000Z",
  },
];

let content = readJson(DB_FILE, null);
let blogs = readJson(BLOGS_FILE, null);
if (!blogs) {
  blogs = SEED_BLOGS;
  writeJson(BLOGS_FILE, blogs);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "6mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

/* ---- portfolio content (db.json) ---- */

app.get("/api/content", (_req, res) => {
  if (!content) return res.status(404).json({ error: "db.json not found" });
  res.json(content);
});

app.put("/api/content", (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid content" });
  }
  content = body;
  writeJson(DB_FILE, content);
  res.json({ ok: true });
});

/* ---- blogs (blogs.db) ---- */

app.get("/api/blogs", (_req, res) => {
  res.json({ blogs });
});

app.get("/api/blogs/:id", (req, res) => {
  const blog = blogs.find((b) => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
});

function buildBlog(body, id) {
  const title = String(body.title ?? "").trim();
  const contentText = String(body.content ?? "").trim();
  if (!title || !contentText) {
    const err = new Error("Title and content are required");
    err.status = 400;
    throw err;
  }
  const words = contentText.split(/\s+/).filter(Boolean).length;
  return {
    id,
    title,
    excerpt: String(body.excerpt ?? "").trim() || contentText.slice(0, 140),
    content: contentText,
    tags: Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    palette:
      String(body.palette ?? "").trim() ||
      "linear-gradient(135deg,#c8ff5e,#5ec8ff)",
    shape: ["ring", "grid", "wave", "aura"].includes(body.shape) ? body.shape : "wave",
    readTime: Math.max(1, Math.round(words / 200)),
    likes: Number.isFinite(body.likes) ? Math.max(0, Math.round(body.likes)) : 0,
    createdAt: body.createdAt ? String(body.createdAt) : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

app.post("/api/blogs", (req, res) => {
  try {
    const id = req.body.id ? String(req.body.id) : crypto.randomUUID();
    const blog = buildBlog(req.body, id);
    blogs = [blog, ...blogs];
    writeJson(BLOGS_FILE, blogs);
    res.status(201).json(blog);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.put("/api/blogs/:id", (req, res) => {
  const i = blogs.findIndex((b) => b.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: "Blog not found" });
  try {
    const blog = buildBlog(req.body, req.params.id);
    blogs = blogs.map((b) => (b.id === req.params.id ? blog : b));
    writeJson(BLOGS_FILE, blogs);
    res.json(blog);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.delete("/api/blogs/:id", (req, res) => {
  const i = blogs.findIndex((b) => b.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: "Blog not found" });
  blogs = blogs.filter((b) => b.id !== req.params.id);
  writeJson(BLOGS_FILE, blogs);
  res.json({ ok: true });
});

app.post("/api/blogs/:id/like", (req, res) => {
  const i = blogs.findIndex((b) => b.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: "Blog not found" });
  const liked = Boolean(req.body && req.body.liked);
  const next = Math.max(0, blogs[i].likes + (liked ? 1 : -1));
  blogs = blogs.map((b, bi) => (bi === i ? { ...b, likes: next } : b));
  writeJson(BLOGS_FILE, blogs);
  res.json({ likes: next });
});

/* ---- static site (production) ---- */

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});