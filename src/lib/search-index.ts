import { getAllChangelogs, getAllRoadmapLessons } from "@/lib/mdx";
import { getBlogData } from "@/services/visitor/blog";
import { getAllProject } from "@/services/visitor/project";

export type SearchDocType = "blog" | "project" | "roadmap" | "changelog";

export interface SearchDoc {
  id: string;
  type: SearchDocType;
  title: string;
  description: string;
  url: string;
  tags: string[];
  date?: string;
}

function stripMdx(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getAllSearchDocs(): Promise<SearchDoc[]> {
  const docs: SearchDoc[] = [];

  const lessons = getAllRoadmapLessons();
  for (const lesson of lessons) {
    docs.push({
      id: `roadmap/${lesson.slug}`,
      type: "roadmap",
      title: lesson.meta.title,
      description: [lesson.meta.description, stripMdx(lesson.content).slice(0, 320)]
        .filter(Boolean)
        .join(" — "),
      url: `/roadmap/${lesson.slug}`,
      tags: [lesson.meta.category, lesson.meta.course, lesson.meta.difficulty].filter(
        (value): value is string => Boolean(value),
      ),
    });
  }

  const changelogs = getAllChangelogs();
  for (const entry of changelogs) {
    docs.push({
      id: `changelog/${entry.slug}`,
      type: "changelog",
      title: `${entry.meta.title} (v${entry.meta.version})`,
      description: entry.meta.description ?? stripMdx(entry.content).slice(0, 280),
      url: `/changelog#${entry.slug}`,
      tags: ["changelog", entry.meta.version].filter(Boolean),
      date: entry.meta.date,
    });
  }

  const [blogs, projects] = await Promise.all([
    getBlogData().catch(() => []),
    getAllProject().catch(() => []),
  ]);

  if (Array.isArray(blogs)) {
    for (const post of blogs) {
      if (!post?.slug) continue;
      docs.push({
        id: `blog/${post.id}`,
        type: "blog",
        title: post.title,
        description: post.description ?? "",
        url: `/blog/${post.slug}?id=${post.id}`,
        tags: post.tag_list ?? [],
        date: post.published_at,
      });
    }
  }

  if (Array.isArray(projects)) {
    for (const project of projects) {
      if (!project?.id) continue;
      docs.push({
        id: `project/${project.id}`,
        type: "project",
        title: project.title,
        description: (project.description ?? "").replace(/<[^>]*>?/gm, "").slice(0, 280),
        url: `/project/${project.id}`,
        tags: [],
        date: project.updated_at ?? project.created_at,
      });
    }
  }

  return docs;
}
