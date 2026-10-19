import type { MetadataRoute } from "next";
import { getAllRoadmapLessons } from "@/lib/mdx";
import { getBlogData } from "@/services/visitor/blog";
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog";
import { getAllProject } from "@/services/visitor/project";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

type Frequency = MetadataRoute.Sitemap[number]["changeFrequency"];

// Only URLs that answer 200: changelog entries are anchors on /changelog, not pages.
const staticRoutes: Array<{ path: string; changeFrequency: Frequency; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/project", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/roadmap", changeFrequency: "weekly", priority: 0.7 },
  { path: "/certificates", changeFrequency: "monthly", priority: 0.6 },
  { path: "/changelog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/stats", changeFrequency: "daily", priority: 0.5 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.5 },
  { path: "/tracker", changeFrequency: "weekly", priority: 0.4 },
  { path: "/chat", changeFrequency: "monthly", priority: 0.4 },
  { path: "/ai", changeFrequency: "monthly", priority: 0.4 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.2 },
];

const dateOr = (value: string | null | undefined, fallback: Date) => (value ? new Date(value) : fallback);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  for (const lesson of getAllRoadmapLessons()) {
    entries.push({ url: `${base}/roadmap/${lesson.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
  }

  const [dev, onsite, projects] = await Promise.all([
    getBlogData(),
    getOnsiteBlogPosts(),
    getAllProject().catch(() => []),
  ]);

  for (const post of dev) {
    if (!post?.slug) continue;
    entries.push({ url: `${base}/blog/${post.slug}`, lastModified: dateOr(post.published_at, now), changeFrequency: "monthly", priority: 0.7 });
  }

  for (const post of onsite) {
    entries.push({ url: `${base}/blog/onsite/${post.slug}`, lastModified: dateOr(post.updated_at ?? post.publishedAt, now), changeFrequency: "monthly", priority: 0.7 });
  }

  for (const project of projects ?? []) {
    if (!project?.id) continue;
    entries.push({ url: `${base}/project/${project.id}`, lastModified: dateOr(project.updated_at, now), changeFrequency: "monthly", priority: 0.7 });
  }

  return entries;
}
