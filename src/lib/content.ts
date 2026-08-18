import { useEffect, useState } from "react";
import { fetchRemoteContent } from "./api";

export type ProjectShape = "ring" | "grid" | "wave" | "aura";

export interface Stat {
  value: string;
  label: string;
}

export interface SkillItem {
  name: string;
  note: string;
}

export interface SkillGroup {
  title: string;
  items: SkillItem[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  client: string;
  year: string;
  tags: string[];
  palette: string;
  shape: ProjectShape;
  description: string;
  tech: string[];
  github: string;
  deployed: string;
}

export interface ExperienceEntry {
  period: string;
  role: string;
  company: string;
  place: string;
  note: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Testimonial {
  text: string;
  name: string;
  role: string;
}

export interface PortfolioContent {
  identity: {
    name: string;
    navName: string;
    heroWordmark: string;
    footerWordmark: string;
    role: string;
    tagline: string;
    taglineHighlight: string;
    location: string;
    city: string;
    timezone: string;
    availability: string;
    availabilityNote: string;
    email: string;
    portrait: string | null;
    portraitCaption: string;
    stampText: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
    stats: Stat[];
    chips: string[];
  };
  skills: {
    heading: string;
    groups: SkillGroup[];
  };
  projects: Project[];
  experience: ExperienceEntry[];
  testimonials: Testimonial[];
  socials: SocialLink[];
}

export const STORAGE_KEY = "amit-gangwar-portfolio-v1";
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "Itsme@portfolio";
export const ADMIN_SESSION_KEY = "amit-gangwar-admin-auth";

export const DEFAULT_CONTENT: PortfolioContent = {
  identity: {
    name: "Amit Gangwar",
    navName: "Amit",
    heroWordmark: "AMIT GANGWAR",
    footerWordmark: "AMIT",
    role: "Full-Stack Developer / UI Engineer",
    tagline:
      "I craft fast, accessible and delightful web experiences where code meets craft. Currently building interfaces that feel less like pages and more like places.",
    taglineHighlight: "code meets craft",
    location: "India — 20.59°N",
    city: "India",
    timezone: "Asia/Kolkata",
    availability: "Available for work — 2026",
    availabilityNote:
      "Open to freelance projects, internships and collaborations. Earlier slots for the right project.",
    email: "your.email@example.com",
    portrait: null,
    portraitCaption: "that's me — Amit",
    stampText: "available · for select work · 2026 ·",
  },
  about: {
    heading: "I design and build interfaces that feel alive.",
    paragraphs: [
      "Hi, I'm Amit — a passionate web developer who loves turning ideas into polished, working products. I care about the details: the pixels, the motion, the way a page loads in under a second.",
      "I've built projects across the stack — from marketing sites and dashboards to full-stack apps — and I'm always learning something new. When I'm not coding, you'll find me sketching UI concepts or pushing my latest project to GitHub.",
    ],
    stats: [
      { value: "10+", label: "Projects shipped" },
      { value: "03+", label: "Years of coding" },
      { value: "∞", label: "Cups of coffee consumed" },
      { value: "100%", label: "Commitment to craft" },
    ],
    chips: ["JavaScript", "TypeScript", "React", "TailwindCSS", "Node.js", "Git & GitHub", "Figma"],
  },
  skills: {
    heading: "A toolkit tuned for the web.",
    groups: [
      {
        title: "Frontend",
        items: [
          { name: "React", note: "Hooks, context, and component architecture." },
          { name: "JavaScript / TypeScript", note: "ES6+ everywhere, types for safety." },
          { name: "HTML & CSS", note: "Semantic markup, responsive layouts, Tailwind." },
          { name: "Framer Motion", note: "Declarative animations and transitions." },
        ],
      },
      {
        title: "Backend & Tools",
        items: [
          { name: "Node.js / Express", note: "REST APIs and server-side logic." },
          { name: "Databases", note: "MongoDB, MySQL, and basic PostgreSQL." },
          { name: "Git & GitHub", note: "Version control and collaboration." },
          { name: "Vite / Build tools", note: "Fast dev loops and optimized builds." },
        ],
      },
      {
        title: "Design & More",
        items: [
          { name: "Figma", note: "Designing and prototyping interfaces." },
          { name: "Responsive design", note: "Mobile-first, fluid layouts." },
          { name: "Performance", note: "Fast load times and clean bundles." },
          { name: "Accessibility", note: "Semantic HTML and keyboard-first UX." },
        ],
      },
    ],
  },
  projects: [
    {
      id: "your-project-one",
      index: "01",
      title: "Your Project One",
      client: "Client / Company",
      year: "2026",
      tags: ["Web app", "React"],
      palette: "linear-gradient(135deg,#c8ff5e,#5ec8ff)",
      shape: "wave",
      description:
        "Placeholder project. Replace this with one of your own — open the admin panel (#/admin), log in, and edit the Selected Work section.",
      tech: ["React", "TypeScript", "TailwindCSS"],
      github: "",
      deployed: "",
    },
    {
      id: "your-project-two",
      index: "02",
      title: "Your Project Two",
      client: "Client / Company",
      year: "2026",
      tags: ["Landing page", "Motion"],
      palette: "linear-gradient(135deg,#ff5ea0,#9b7bff)",
      shape: "ring",
      description:
        "Placeholder project. Replace this with one of your own — open the admin panel (#/admin), log in, and edit the Selected Work section.",
      tech: ["React", "Framer Motion", "Vite"],
      github: "",
      deployed: "",
    },
    {
      id: "your-project-three",
      index: "03",
      title: "Your Project Three",
      client: "Client / Company",
      year: "2025",
      tags: ["Dashboard", "Full-stack"],
      palette: "linear-gradient(135deg,#5ec8ff,#9b7bff)",
      shape: "grid",
      description:
        "Placeholder project. Replace this with one of your own — open the admin panel (#/admin), log in, and edit the Selected Work section.",
      tech: ["Node.js", "Express", "MongoDB"],
      github: "",
      deployed: "",
    },
  ],
  experience: [
    {
      period: "2025 — Now",
      role: "Web Developer",
      company: "Freelance / Personal",
      place: "Remote",
      note: "Building and shipping client work and personal projects.\nExperimenting with new tools and pushing my craft further.",
    },
    {
      period: "2024 — 2025",
      role: "Developer",
      company: "Your Company",
      place: "Remote",
      note: "Replace this entry with your own experience.\nAdd as many bullet points as you like — one per line.",
    },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X / Twitter", href: "https://x.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
  ],
  testimonials: [
    {
      text: "Amit writes clean code and explains complex ideas effortlessly. Curious, funny, and always asking the right questions.",
      name: "Mohd Waseem",
      role: "Software Engineer, Coforge",
    },
    {
      text: "Fast shipping with attention to detail. His curiosity and clarity when explaining technical concepts are exceptional.",
      name: "Abhishek Dixit",
      role: "Software Engineer, i8CLOUD",
    },
    {
      text: "Deep technical understanding combined with exceptional clarity. Curious about learning and making things understandable for everyone.",
      name: "Arohi Singh",
      role: "DevOps Engineer, Amazon",
    },
    {
      text: "Technically strong with rare clarity in explanations. Curious, humble, and brings humor to problem-solving.",
      name: "Mohit Singh",
      role: "Senior Software Engineer, Deutsche Bank",
    },
  ],
};

export function normalizeContent(parsed: Partial<PortfolioContent>): PortfolioContent {
  return {
    identity: { ...DEFAULT_CONTENT.identity, ...(parsed.identity ?? {}) },
    about: { ...DEFAULT_CONTENT.about, ...(parsed.about ?? {}) },
    skills: { ...DEFAULT_CONTENT.skills, ...(parsed.skills ?? {}) },
    projects: parsed.projects ?? DEFAULT_CONTENT.projects,
    experience: parsed.experience ?? DEFAULT_CONTENT.experience,
    testimonials: parsed.testimonials ?? DEFAULT_CONTENT.testimonials,
    socials: parsed.socials ?? DEFAULT_CONTENT.socials,
  };
}

export function loadContent(): PortfolioContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    return normalizeContent(JSON.parse(raw) as Partial<PortfolioContent>);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content: PortfolioContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    /* storage full — ignore */
  }
  listeners.forEach((fn) => fn());
}

export function resetContent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn());
}

const listeners = new Set<() => void>();

/** Reactive hook — re-reads content whenever saveContent/resetContent is called.
 *  Loads the browser cache instantly, then upgrades with the server copy (db.json). */
export function useContent(): PortfolioContent {
  const [content, setContent] = useState<PortfolioContent>(() => loadContent());
  useEffect(() => {
    let cancelled = false;
    fetchRemoteContent().then((remote) => {
      if (cancelled || !remote) return;
      setContent(remote);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      } catch {
        /* ignore */
      }
    });
    const fn = () => setContent(loadContent());
    listeners.add(fn);
    return () => {
      cancelled = true;
      listeners.delete(fn);
    };
  }, []);
  return content;
}

/** Downscale an uploaded image to a compact JPEG data URL (fits localStorage). */
export function resizeImage(file: File, max = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "A";
  const b = parts[1]?.[0] ?? "M";
  return `${a}·${b}`.toUpperCase();
}