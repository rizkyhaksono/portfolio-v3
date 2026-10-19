import { getAllChangelogs, getAllRoadmapLessons } from "@/lib/mdx";
import { NAV_SECTIONS } from "@/commons/constants/navigation-menu";
import { getBlogData } from "@/services/visitor/blog";
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog";
import { getAllProject } from "@/services/visitor/project";

export type SearchDocType = "page" | "blog" | "project" | "roadmap" | "changelog";

export interface SearchDoc {
  id: string;
  type: SearchDocType;
  title: string;
  description: string;
  url: string;
  tags: string[];
  date?: string;
}

// [anchor id, heading, note]: the home page's literal h2s.
const HOME_SECTIONS = [
  ["about", "About", "Who I am, my résumé and portfolio."],
  ["skills", "Skills", "The AI and engineering work I focus on."],
  ["career", "Career", "Work and education, newest first."],
  ["activity", "Activity", "GitHub contributions, coding time and streaks."],
  ["credentials", "Credentials", "Recent certificates and courses."],
  ["readers", "Readers", "How many people read the site, and what they read most."],
  ["recommendations", "Recommendations", "What colleagues say about working with me."],
  ["contact", "Contact", "Email, socials and a message form."],
] as const;

// [?tab= value, name, note]: the tools cabinet.
const TOOL_TABS = [
  ["pokemon", "Pokédex", "Look up a Pokémon by name or number."],
  ["starwars", "Star Wars", "Characters from the films and their affiliations."],
  ["japanese-quiz", "Japanese quiz", "JLPT vocabulary practice."],
  ["ielts", "IELTS flashcards", "Vocabulary cards for the IELTS exam."],
  ["downloader", "Downloader", "Save TikTok, Instagram and Facebook videos."],
  ["wpm", "Typing test", "Words per minute and accuracy."],
  ["postal-code", "Postal codes", "Indonesian postal codes by province, city, district and village."],
  ["web3-crypto", "Web3 crypto", "Coin prices and network gas fees."],
] as const;

function stripMdx(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function pageDocs(): SearchDoc[] {
  const page = (url: string, title: string, description: string, tags: string[] = []): SearchDoc => ({
    id: `page${url}`,
    type: "page",
    title,
    description,
    url,
    tags,
  });

  return [
    ...NAV_SECTIONS.map((section) => page(section.href, section.label, section.note)),
    page("/legal/privacy", "Privacy", "What this site collects, and why."),
    page("/legal/terms", "Terms", "The terms for using this site and its tools."),
    ...HOME_SECTIONS.map(([id, title, note]) => page(`/#${id}`, title, note, ["home"])),
    ...TOOL_TABS.map(([tab, title, note]) => page(`/tools?tab=${tab}`, title, note, ["tools"])),
  ];
}

export async function getAllSearchDocs(): Promise<SearchDoc[]> {
  const docs: SearchDoc[] = pageDocs();

  for (const lesson of getAllRoadmapLessons()) {
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

  for (const entry of getAllChangelogs()) {
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

  const [dev, onsite, projects] = await Promise.all([
    getBlogData(),
    getOnsiteBlogPosts(),
    getAllProject().catch(() => []),
  ]);

  for (const post of dev) {
    if (!post?.slug) continue;
    docs.push({
      id: `blog/${post.slug}`,
      type: "blog",
      title: post.title,
      description: post.description ?? "",
      url: `/blog/${post.slug}`,
      tags: post.tag_list ?? [],
      date: post.published_at,
    });
  }

  for (const post of onsite) {
    docs.push({
      id: `blog/onsite/${post.slug}`,
      type: "blog",
      title: post.title,
      description: post.description ?? "",
      url: `/blog/onsite/${post.slug}`,
      tags: [],
      date: post.publishedAt ?? post.created_at,
    });
  }

  for (const project of projects ?? []) {
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

  return docs;
}
