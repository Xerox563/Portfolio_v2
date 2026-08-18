import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ADMIN_PASS,
  ADMIN_SESSION_KEY,
  ADMIN_USER,
  DEFAULT_CONTENT,
  loadContent,
  normalizeContent,
  resetContent,
  resizeImage,
  saveContent,
  type PortfolioContent,
  type Project,
  type ProjectShape,
  type SkillGroup,
} from "../lib/content";
import {
  createBlog,
  deleteBlog,
  fetchRemoteContent,
  getBlogs,
  saveContentRemote,
  updateBlog,
  type Blog,
  type BlogInput,
} from "../lib/api";

const SHAPES: ProjectShape[] = ["ring", "grid", "wave", "aura"];
const SHAPE_LABELS: Record<ProjectShape, string> = {
  ring: "Ring",
  grid: "Grid",
  wave: "Wave",
  aura: "Aura",
};
const PALETTES = [
  "linear-gradient(135deg,#c8ff5e,#5ec8ff)",
  "linear-gradient(135deg,#ff5ea0,#9b7bff)",
  "linear-gradient(135deg,#5ec8ff,#9b7bff)",
  "linear-gradient(135deg,#9b7bff,#ff5ea0)",
  "linear-gradient(135deg,#c8ff5e,#ff5ea0)",
];

type Tab = "profile" | "about" | "skills" | "projects" | "experience" | "blogs" | "links";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blogs", label: "Blogs" },
  { id: "links", label: "Links" },
];

export function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "1"
  );

  if (!authed) {
    return (
      <Login
        onOk={() => {
          sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
          setAuthed(true);
        }}
      />
    );
  }
  return <Dashboard />;
}

function Login({ onOk }: { onOk: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) onOk();
    else setError(true);
  };

  return (
    <div className="admin-view admin-login">
      <div className="noise" aria-hidden />
      <form className="admin-login__card glass" onSubmit={submit}>
        <div className="admin-login__mark" aria-hidden />
        <h1 className="admin-login__title display">Portfolio Admin</h1>
        <p className="admin-login__sub">
          Sign in to manage your portfolio content.
        </p>
        <Field label="Username">
          <input
            className="admin-input"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setError(false);
            }}
            autoFocus
            autoComplete="username"
          />
        </Field>
        <Field label="Password">
          <input
            className="admin-input"
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setError(false);
            }}
            autoComplete="current-password"
          />
        </Field>
        {error && <p className="admin-login__error">Wrong username or password.</p>}
        <button className="btn admin-login__btn" type="submit" style={{ cursor: "pointer" }}>
          <span className="btn__fill" />
          Sign in
        </button>
        <a className="admin-login__back" href="#home" style={{ cursor: "pointer" }}>
          ← Back to site
        </a>
      </form>
    </div>
  );
}

function Dashboard() {
  const [draft, setDraft] = useState<PortfolioContent>(() => normalizeContent(loadContent()));
  const [tab, setTab] = useState<Tab>("profile");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRemoteContent().then((remote) => {
      if (!cancelled && remote) {
        setDraft(normalizeContent(remote));
        setDirty(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = (fn: (d: PortfolioContent) => PortfolioContent) => {
    setDraft(fn(draft));
    setDirty(true);
    setSaved(false);
  };

  const save = async () => {
    const normalized = normalizeContent(draft);
    const ok = await saveContentRemote(normalized);
    saveContent(normalized);
    setDirty(false);
    setSaved(true);
    setSaveNote(ok ? "Saved to db.json on the server" : "Server offline — saved in browser only");
    setTimeout(() => setSaved(false), 3000);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(normalizeContent(draft), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<PortfolioContent>;
        setDraft(normalizeContent(parsed));
        setDirty(true);
        setSaved(false);
      } catch {
        window.alert("Could not read that file — is it a valid JSON export?");
      }
    };
    reader.readAsText(file);
  };

  const reset = async () => {
    if (window.confirm("Reset ALL content to the defaults? This cannot be undone.")) {
      resetContent();
      await saveContentRemote(DEFAULT_CONTENT);
      setDraft(normalizeContent(DEFAULT_CONTENT));
      setDirty(false);
      setSaved(false);
    }
  };

  return (
    <div className="admin-view">
      <div className="noise" aria-hidden />
      <header className="admin__header">
        <div className="admin__header-inner">
          <div className="admin__brand">
            <span className="admin__brand-mark" aria-hidden />
            <span className="admin__brand-name display">Portfolio Admin</span>
          </div>
          <div className="admin__header-actions">
            <a href="#home" className="admin__link" style={{ cursor: "pointer" }}>
              View site ↗
            </a>
            <button className="admin__link" onClick={exportJson}>Export JSON</button>
            <button className="admin__link" onClick={() => fileRef.current?.click()}>
              Import JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importJson(f);
                e.target.value = "";
              }}
            />
            <button className="admin__link admin__link--danger" onClick={reset}>
              Reset
            </button>
            <button
              className="admin__link"
              onClick={() => {
                sessionStorage.removeItem(ADMIN_SESSION_KEY);
                window.location.reload();
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="admin__tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className="admin__tab"
              data-active={tab === t.id}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="admin__main">
        {tab === "profile" && <ProfileTab draft={draft} patch={patch} />}
        {tab === "about" && <AboutTab draft={draft} patch={patch} />}
        {tab === "skills" && <SkillsTab draft={draft} patch={patch} />}
        {tab === "projects" && <ProjectsTab draft={draft} patch={patch} />}
        {tab === "experience" && <ExperienceTab draft={draft} patch={patch} />}
        {tab === "blogs" && <BlogsTab />}
        {tab === "links" && <LinksTab draft={draft} patch={patch} />}
      </main>

      <div className="admin__savebar">
        <span className="admin__savebar-status">
          {saved
            ? `✓ ${saveNote}`
            : dirty
              ? "Unsaved changes"
              : "All changes saved"}
        </span>
        <button
          className="btn admin__savebar-btn"
          onClick={save}
          disabled={!dirty}
          style={{ cursor: dirty ? "pointer" : "default" }}
        >
          <span className="btn__fill" />
          Save changes
        </button>
      </div>
    </div>
  );
}

/* ===== shared form primitives ===== */

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="admin-field">
      <span className="admin-field__label">
        {label}
        {hint && <em>{hint}</em>}
      </span>
      {children}
    </label>
  );
}

function TInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      className="admin-input"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function TArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className="admin-input admin-input--area"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Card({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="admin-card glass">
      <header className="admin-card__head">
        <h3 className="admin-card__title">{title}</h3>
        {actions}
      </header>
      {children}
    </section>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button className="admin-mini admin-mini--danger" onClick={onClick}>
      Remove
    </button>
  );
}

function AddBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button className="admin-mini admin-mini--add" onClick={onClick}>
      + {children}
    </button>
  );
}

/* ===== profile ===== */

function ProfileTab({
  draft,
  patch,
}: {
  draft: PortfolioContent;
  patch: (fn: (d: PortfolioContent) => PortfolioContent) => void;
}) {
  const id = draft.identity;

  const onPortrait = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      patch((d) => ({ ...d, identity: { ...d.identity, portrait: dataUrl } }));
    } catch {
      window.alert("Could not read that image.");
    }
  };

  return (
    <div className="admin-panel">
      <Card title="Portrait">
        <div className="admin-row">
          <div className="admin-portrait">
            {id.portrait ? (
              <img src={id.portrait} alt="Current portrait" />
            ) : (
              <span className="admin-portrait__empty display">A·M</span>
            )}
          </div>
          <div className="admin-portrait__actions">
            <label className="admin-mini admin-mini--add" style={{ cursor: "pointer" }}>
              {id.portrait ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  onPortrait(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {id.portrait && (
              <RemoveBtn onClick={() => patch((d) => ({ ...d, identity: { ...d.identity, portrait: null } }))} />
            )}
            <p className="admin-hint">
              Shown in the About section. Images are resized automatically and stored in your
              browser.
            </p>
          </div>
        </div>
        <Field label="Portrait caption">
          <TInput value={id.portraitCaption} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, portraitCaption: v } }))} />
        </Field>
      </Card>

      <Card title="Name & branding">
        <div className="admin-grid">
          <Field label="Full name">
            <TInput value={id.name} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, name: v } }))} />
          </Field>
          <Field label="Navbar name">
            <TInput value={id.navName} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, navName: v } }))} />
          </Field>
          <Field label="Hero wordmark" hint="big title, uppercase">
            <TInput value={id.heroWordmark} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, heroWordmark: v } }))} />
          </Field>
          <Field label="Footer wordmark">
            <TInput value={id.footerWordmark} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, footerWordmark: v } }))} />
          </Field>
        </div>
        <Field label="Role line" hint="shown as “X / Y” under the hero">
          <TInput value={id.role} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, role: v } }))} />
        </Field>
      </Card>

      <Card title="Hero & status">
        <Field label="Tagline">
          <TArea value={id.tagline} rows={3} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, tagline: v } }))} />
        </Field>
        <Field label="Tagline highlight" hint="words rendered in italic gradient">
          <TInput value={id.taglineHighlight} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, taglineHighlight: v } }))} />
        </Field>
        <div className="admin-grid">
          <Field label="Location" hint="hero corner">
            <TInput value={id.location} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, location: v } }))} />
          </Field>
          <Field label="City" hint="footer clock">
            <TInput value={id.city} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, city: v } }))} />
          </Field>
          <Field label="Clock timezone" hint="IANA, e.g. Asia/Kolkata">
            <TInput value={id.timezone} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, timezone: v } }))} />
          </Field>
          <Field label="Availability" hint="hero + contact">
            <TInput value={id.availability} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, availability: v } }))} />
          </Field>
        </div>
        <Field label="Availability note" hint="contact card">
          <TArea value={id.availabilityNote} rows={2} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, availabilityNote: v } }))} />
        </Field>
        <Field label="Email" hint="used across the site">
          <TInput value={id.email} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, email: v } }))} />
        </Field>
        <Field label="Stamp text" hint="rotating circular stamp, About section">
          <TInput value={id.stampText} onChange={(v) => patch((d) => ({ ...d, identity: { ...d.identity, stampText: v } }))} />
        </Field>
      </Card>
    </div>
  );
}

/* ===== about ===== */

function AboutTab({
  draft,
  patch,
}: {
  draft: PortfolioContent;
  patch: (fn: (d: PortfolioContent) => PortfolioContent) => void;
}) {
  const a = draft.about;
  return (
    <div className="admin-panel">
      <Card title="About section">
        <Field label="Heading" hint="last two words get the italic gradient">
          <TInput value={a.heading} onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, heading: v } }))} />
        </Field>
        <Field label="Paragraphs" hint="one paragraph per line">
          <TArea rows={6} value={a.paragraphs.join("\n")} onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, paragraphs: v.split("\n") } }))} />
        </Field>
        <Field label="Skill chips" hint="comma separated">
          <TInput value={a.chips.join(", ")} onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, chips: v.split(",").map((s) => s.trim()).filter(Boolean) } }))} />
        </Field>
      </Card>

      <Card
        title="Stats"
        actions={
          <AddBtn
            onClick={() =>
              patch((d) => ({ ...d, about: { ...d.about, stats: [...d.about.stats, { value: "00", label: "New stat" }] } }))
            }
          >
            Stat
          </AddBtn>
        }
      >
        <div className="admin-list">
          {a.stats.map((s, i) => (
            <div className="admin-row" key={i}>
              <TInput value={s.value} placeholder="Value" onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, stats: d.about.stats.map((x, xi) => (xi === i ? { ...x, value: v } : x)) } }))} />
              <TInput value={s.label} placeholder="Label" onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, stats: d.about.stats.map((x, xi) => (xi === i ? { ...x, label: v } : x)) } }))} />
              <RemoveBtn onClick={() => patch((d) => ({ ...d, about: { ...d.about, stats: d.about.stats.filter((_, xi) => xi !== i) } }))} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ===== skills ===== */

function SkillsTab({
  draft,
  patch,
}: {
  draft: PortfolioContent;
  patch: (fn: (d: PortfolioContent) => PortfolioContent) => void;
}) {
  const s = draft.skills;

  const updateGroup = (i: number, g: SkillGroup) =>
    patch((d) => ({ ...d, skills: { ...d.skills, groups: d.skills.groups.map((x, xi) => (xi === i ? g : x)) } }));

  const itemsToText = (g: SkillGroup) =>
    g.items.map((it) => (it.note ? `${it.name} — ${it.note}` : it.name)).join("\n");

  const textToItems = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const sep = line.indexOf("—");
        if (sep === -1) return { name: line, note: "" };
        return { name: line.slice(0, sep).trim(), note: line.slice(sep + 1).trim() };
      });

  return (
    <div className="admin-panel">
      <Card title="Skills section">
        <Field label="Heading" hint="last word gets the italic gradient">
          <TInput value={s.heading} onChange={(v) => patch((d) => ({ ...d, skills: { ...d.skills, heading: v } }))} />
        </Field>
      </Card>

      <Card
        title="Groups"
        actions={
          <AddBtn
            onClick={() =>
              patch((d) => ({ ...d, skills: { ...d.skills, groups: [...d.skills.groups, { title: "New group", items: [{ name: "Skill", note: "A short note." }] }] } }))
            }
          >
            Group
          </AddBtn>
        }
      >
        <div className="admin-list">
          {s.groups.map((g, i) => (
            <div className="admin-card admin-card--nested glass" key={i}>
              <div className="admin-row">
                <TInput value={g.title} placeholder="Group title" onChange={(v) => updateGroup(i, { ...g, title: v })} />
                <RemoveBtn onClick={() => patch((d) => ({ ...d, skills: { ...d.skills, groups: d.skills.groups.filter((_, xi) => xi !== i) } }))} />
              </div>
              <Field label="Skills" hint="one per line: “Name — note”">
                <TArea
                  rows={6}
                  value={itemsToText(g)}
                  onChange={(v) => updateGroup(i, { ...g, items: textToItems(v) })}
                />
              </Field>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ===== projects ===== */

function ProjectsTab({
  draft,
  patch,
}: {
  draft: PortfolioContent;
  patch: (fn: (d: PortfolioContent) => PortfolioContent) => void;
}) {
  const projects = draft.projects;

  const updateProject = (i: number, p: Project) =>
    patch((d) => ({ ...d, projects: d.projects.map((x, xi) => (xi === i ? p : x)) }));

  const addProject = () => {
    const n = projects.length + 1;
    const title = `Project ${n}`;
    patch((d) => ({
      ...d,
      projects: [
        ...d.projects,
        {
          id: `project-${n}-${Date.now()}`,
          index: String(n).padStart(2, "0"),
          title,
          client: "Client / Company",
          year: new Date().getFullYear().toString(),
          tags: ["Web app"],
          palette: "linear-gradient(135deg,#c8ff5e,#5ec8ff)",
          shape: "wave",
          description: "",
          tech: [],
          github: "",
          deployed: "",
        },
      ],
    }));
  };

  return (
    <div className="admin-panel">
      <Card
        title="Selected work"
        actions={<AddBtn onClick={addProject}>Project</AddBtn>}
      >
        <p className="admin-hint">
          Clicking a project on the site opens a detail view with the description, tech stack,
          GitHub link and live link. Leave a link empty to hide its button.
        </p>
        <div className="admin-list">
          {projects.map((p, i) => (
            <div className="admin-card admin-card--nested glass" key={p.id}>
              <header className="admin-card__head">
                <h4 className="admin-card__title">
                  <span className="admin-card__index">{p.index}</span> {p.title}
                </h4>
                <RemoveBtn onClick={() => patch((d) => ({ ...d, projects: d.projects.filter((_, xi) => xi !== i) }))} />
              </header>

              <div className="admin-grid">
                <Field label="Title">
                  <TInput value={p.title} onChange={(v) => updateProject(i, { ...p, title: v })} />
                </Field>
                <Field label="Index" hint="e.g. 01">
                  <TInput value={p.index} onChange={(v) => updateProject(i, { ...p, index: v })} />
                </Field>
                <Field label="Client / Company">
                  <TInput value={p.client} onChange={(v) => updateProject(i, { ...p, client: v })} />
                </Field>
                <Field label="Year">
                  <TInput value={p.year} onChange={(v) => updateProject(i, { ...p, year: v })} />
                </Field>
              </div>

              <div className="admin-grid">
                <Field label="Tags" hint="comma separated">
                  <TInput
                    value={p.tags.join(", ")}
                    onChange={(v) =>
                      updateProject(i, { ...p, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })
                    }
                  />
                </Field>
                <Field label="Tech stack" hint="comma separated">
                  <TInput
                    value={p.tech.join(", ")}
                    onChange={(v) =>
                      updateProject(i, { ...p, tech: v.split(",").map((s) => s.trim()).filter(Boolean) })
                    }
                  />
                </Field>
                <Field label="GitHub link" hint="leave empty to hide">
                  <TInput value={p.github} onChange={(v) => updateProject(i, { ...p, github: v })} />
                </Field>
                <Field label="Live link" hint="leave empty to hide">
                  <TInput value={p.deployed} onChange={(v) => updateProject(i, { ...p, deployed: v })} />
                </Field>
              </div>

              <div className="admin-grid admin-grid--2">
                <Field label="Preview gradient" hint="CSS background value">
                  <TInput value={p.palette} onChange={(v) => updateProject(i, { ...p, palette: v })} />
                </Field>
                <Field label="Preview shape">
                  <select
                    className="admin-input"
                    value={p.shape}
                    onChange={(e) => updateProject(i, { ...p, shape: e.target.value as ProjectShape })}
                  >
                    {SHAPES.map((s) => (
                      <option key={s} value={s}>{SHAPE_LABELS[s]}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Description" hint="shown in the detail view">
                <TArea rows={4} value={p.description} onChange={(v) => updateProject(i, { ...p, description: v })} />
              </Field>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ===== experience ===== */

function ExperienceTab({
  draft,
  patch,
}: {
  draft: PortfolioContent;
  patch: (fn: (d: PortfolioContent) => PortfolioContent) => void;
}) {
  const entries = draft.experience;

  const updateEntry = (i: number, e: PortfolioContent["experience"][number]) =>
    patch((d) => ({ ...d, experience: d.experience.map((x, xi) => (xi === i ? e : x)) }));

  return (
    <div className="admin-panel">
      <Card
        title="Experience timeline"
        actions={
          <AddBtn
            onClick={() =>
              patch((d) => ({
                ...d,
                experience: [
                  ...d.experience,
                  { period: "2026 — Now", role: "Role", company: "Company", place: "Remote", note: "Bullet point one.\nBullet point two." },
                ],
              }))
            }
          >
            Entry
          </AddBtn>
        }
      >
        <p className="admin-hint">
          The note supports one bullet point per line — the timeline renders them as a list.
        </p>
        <div className="admin-list">
          {entries.map((e, i) => (
            <div className="admin-card admin-card--nested glass" key={i}>
              <div className="admin-grid">
                <Field label="Period">
                  <TInput value={e.period} onChange={(v) => updateEntry(i, { ...e, period: v })} />
                </Field>
                <Field label="Role">
                  <TInput value={e.role} onChange={(v) => updateEntry(i, { ...e, role: v })} />
                </Field>
                <Field label="Company">
                  <TInput value={e.company} onChange={(v) => updateEntry(i, { ...e, company: v })} />
                </Field>
                <Field label="Place">
                  <TInput value={e.place} onChange={(v) => updateEntry(i, { ...e, place: v })} />
                </Field>
              </div>
              <Field label="Notes" hint="one bullet per line">
                <TArea rows={4} value={e.note} onChange={(v) => updateEntry(i, { ...e, note: v })} />
              </Field>
              <RemoveBtn onClick={() => patch((d) => ({ ...d, experience: d.experience.filter((_, xi) => xi !== i) }))} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ===== blogs ===== */

const EMPTY_BLOG: BlogInput = {
  title: "",
  excerpt: "",
  content: "",
  tags: [],
  palette: PALETTES[0],
  shape: "wave",
};

function BlogsTab() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [offline, setOffline] = useState(false);
  const [form, setForm] = useState<BlogInput | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = async () => {
    const list = await getBlogs();
    if (list) {
      setBlogs(list);
      setOffline(false);
    } else {
      setOffline(true);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const setField = <K extends keyof BlogInput>(key: K, value: BlogInput[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const saveBlog = async () => {
    if (!form) return;
    if (!form.title.trim() || !form.content.trim()) {
      window.alert("Title and content are required.");
      return;
    }
    if (editingId) await updateBlog(editingId, form);
    else await createBlog(form);
    setForm(null);
    setEditingId(null);
    refresh();
  };

  const removeBlog = async (blog: Blog) => {
    if (!window.confirm(`Delete “${blog.title}”?`)) return;
    await deleteBlog(blog.id);
    refresh();
  };

  if (offline && blogs === null) {
    return (
      <div className="admin-panel">
        <div className="admin-card glass">
          <p className="admin-hint">
            Server offline — start it with <code>npm run server</code> to manage blogs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-card glass">
        <header className="admin-card__head">
          <h3 className="admin-card__title">Journal — blogs.db</h3>
          <AddBtn
            onClick={() => {
              setForm(EMPTY_BLOG);
              setEditingId(null);
            }}
          >
            New blog
          </AddBtn>
        </header>
        <p className="admin-hint">
          Shown in the Journal section: 6 on the page (3 per row), “View all” reveals the rest.
          Blog posts are stored on the server in <code>blogs.db</code>.
        </p>

        {form && (
          <div className="admin-card admin-card--nested glass">
            <header className="admin-card__head">
              <h4 className="admin-card__title">
                {editingId ? "Edit blog" : "New blog"}
              </h4>
              <button className="admin-mini" onClick={() => { setForm(null); setEditingId(null); }}>
                Cancel
              </button>
            </header>
            <Field label="Title">
              <TInput value={form.title} onChange={(v) => setField("title", v)} />
            </Field>
            <Field label="Excerpt" hint="short teaser for the card">
              <TArea rows={2} value={form.excerpt} onChange={(v) => setField("excerpt", v)} />
            </Field>
            <Field label="Content" hint="paragraphs separated by a blank line">
              <TArea rows={10} value={form.content} onChange={(v) => setField("content", v)} />
            </Field>
            <div className="admin-grid">
              <Field label="Tags" hint="comma separated">
                <TInput
                  value={form.tags.join(", ")}
                  onChange={(v) =>
                    setField("tags", v.split(",").map((s) => s.trim()).filter(Boolean))
                  }
                />
              </Field>
              <Field label="Preview shape">
                <select
                  className="admin-input"
                  value={form.shape}
                  onChange={(e) => setField("shape", e.target.value as ProjectShape)}
                >
                  {SHAPES.map((s) => (
                    <option key={s} value={s}>{SHAPE_LABELS[s]}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Preview gradient" hint="choose a preset or paste your own CSS">
              <select
                className="admin-input"
                value={form.palette}
                onChange={(e) => setField("palette", e.target.value)}
              >
                {PALETTES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <div className="admin-row">
              <button className="btn" onClick={saveBlog} style={{ cursor: "pointer" }}>
                <span className="btn__fill" />
                {editingId ? "Save changes" : "Publish blog"}
              </button>
              <span className="admin-hint">
                Read time is estimated automatically from the content length.
              </span>
            </div>
          </div>
        )}

        {blogs !== null && blogs.length === 0 && !form && (
          <p className="admin-hint">No blogs yet. Publish your first note above.</p>
        )}

        <div className="admin-list">
          {(blogs ?? []).map((b) => (
            <div className="admin-card admin-card--nested glass" key={b.id}>
              <header className="admin-card__head">
                <h4 className="admin-card__title">{b.title}</h4>
                <div className="admin-row" style={{ gap: "0.4rem" }}>
                  <span className="admin-hint">{b.likes} ♥ · {b.readTime} min</span>
                  <button
                    className="admin-mini"
                    onClick={() => {
                      setForm({
                        title: b.title,
                        excerpt: b.excerpt,
                        content: b.content,
                        tags: b.tags,
                        palette: b.palette,
                        shape: b.shape,
                      });
                      setEditingId(b.id);
                    }}
                  >
                    Edit
                  </button>
                  <RemoveBtn onClick={() => removeBlog(b)} />
                </div>
              </header>
              {b.excerpt && <p className="admin-hint">{b.excerpt}</p>}
              {b.tags.length > 0 && (
                <div className="admin-row">
                  {b.tags.map((t) => (
                    <span key={t} className="work__row-tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== links ===== */

function LinksTab({
  draft,
  patch,
}: {
  draft: PortfolioContent;
  patch: (fn: (d: PortfolioContent) => PortfolioContent) => void;
}) {
  const socials = draft.socials;

  return (
    <div className="admin-panel">
      <Card
        title="Elsewhere — social links"
        actions={
          <AddBtn
            onClick={() => patch((d) => ({ ...d, socials: [...d.socials, { label: "New link", href: "https://" }] }))}
          >
            Link
          </AddBtn>
        }
      >
        <div className="admin-list">
          {socials.map((s, i) => (
            <div className="admin-row" key={i}>
              <TInput
                value={s.label}
                placeholder="Label (e.g. LinkedIn)"
                onChange={(v) => patch((d) => ({ ...d, socials: d.socials.map((x, xi) => (xi === i ? { ...x, label: v } : x)) }))}
              />
              <TInput
                value={s.href}
                placeholder="https://…"
                onChange={(v) => patch((d) => ({ ...d, socials: d.socials.map((x, xi) => (xi === i ? { ...x, href: v } : x)) }))}
              />
              <RemoveBtn onClick={() => patch((d) => ({ ...d, socials: d.socials.filter((_, xi) => xi !== i) }))} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}