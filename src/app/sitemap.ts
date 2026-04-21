import type { MetadataRoute } from "next";
import { getAllChangelogs, getAllRoadmapLessons } from "@/lib/mdx";
import { getBlogData } from "@/services/visitor/blog";
import { getAllProject } from "@/services/visitor/project";

export const revalidate = 3600;

function getBaseUrl(): string {
  const raw = process.env.DOMAIN ?? "https://www.natee.my.id";
  return raw.replace(/\/$/, "");
}

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/project", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/certificates", changeFrequency: "monthly", priority: 0.6 },
  { path: "/changelog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/chat", changeFrequency: "monthly", priority: 0.4 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.5 },
  { path: "/roadmap", changeFrequency: "weekly", priority: 0.7 },
  { path: "/signal", changeFrequency: "monthly", priority: 0.4 },
  { path: "/ai", changeFrequency: "monthly", priority: 0.4 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const changelogs = getAllChangelogs();
  for (const item of changelogs) {
    entries.push({
      url: `${base}/changelog/${item.slug}`,
      lastModified: new Date(item.meta.date),
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  const lessons = getAllRoadmapLessons();
  for (const lesson of lessons) {
    entries.push({
      url: `${base}/roadmap/${lesson.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  const [blogs, projects] = await Promise.all([
    getBlogData().catch(() => []),
    getAllProject().catch(() => []),
  ]);

  if (Array.isArray(blogs)) {
    for (const post of blogs) {
      if (!post?.slug) continue;
      entries.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  if (Array.isArray(projects)) {
    for (const project of projects) {
      if (!project?.id) continue;
      entries.push({
        url: `${base}/project/${project.id}`,
        lastModified: project.updated_at ? new Date(project.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
