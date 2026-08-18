import {
  normalizeContent,
  type PortfolioContent,
  type ProjectShape,
} from "./content";

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  palette: string;
  shape: ProjectShape;
  readTime: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogInput {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  palette: string;
  shape: ProjectShape;
}

async function request<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/* ---- portfolio content ---- */

export async function fetchRemoteContent(): Promise<PortfolioContent | null> {
  const data = await request<Partial<PortfolioContent>>("/api/content");
  return data ? normalizeContent(data) : null;
}

export async function saveContentRemote(content: PortfolioContent): Promise<boolean> {
  const res = await request<{ ok: boolean }>("/api/content", json("PUT", content));
  return res?.ok ?? false;
}

/* ---- blogs ---- */

export async function getBlogs(): Promise<Blog[] | null> {
  const res = await request<{ blogs: Blog[] }>("/api/blogs");
  return res?.blogs ?? null;
}

export async function createBlog(input: BlogInput): Promise<Blog | null> {
  return request<Blog>("/api/blogs", json("POST", input));
}

export async function updateBlog(id: string, input: BlogInput): Promise<Blog | null> {
  return request<Blog>(`/api/blogs/${encodeURIComponent(id)}`, json("PUT", input));
}

export async function deleteBlog(id: string): Promise<boolean> {
  const res = await request<{ ok: boolean }>(`/api/blogs/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return res?.ok ?? false;
}

export async function likeBlog(id: string, liked: boolean): Promise<number | null> {
  const res = await request<{ likes: number }>(
    `/api/blogs/${encodeURIComponent(id)}/like`,
    json("POST", { liked })
  );
  return res?.likes ?? null;
}