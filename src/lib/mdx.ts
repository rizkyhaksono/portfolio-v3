import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export interface ChangelogMeta {
  title: string
  date: string
  version: string
  author: string
  description?: string
}

export interface ChangelogContent {
  meta: ChangelogMeta
  content: string
  slug: string
}

export type RoadmapLevel = "beginner" | "intermediate" | "advanced"

export interface RoadmapMeta {
  title: string
  description: string
  course: string
  category: string
  difficulty: string
  level: RoadmapLevel
  duration: string
  video?: string
  illustration?: string
  order: number
}

export interface RoadmapContent {
  meta: RoadmapMeta
  content: string
  slug: string
}

// Front matter is untyped: a date can be missing or invalid, a version can be absent or a YAML number.
const time = (date: string) => new Date(date).getTime() || 0
const version = (meta: ChangelogMeta) => String(meta.version ?? '')

// Changelog functions
export function getAllChangelogs(): ChangelogContent[] {
  const changelogDir = path.join(contentDir, 'changelog')

  if (!fs.existsSync(changelogDir)) {
    return []
  }

  const files = fs.readdirSync(changelogDir)

  const changelogs = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(changelogDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        meta: data as ChangelogMeta,
        content,
        slug,
      }
    })
    .sort(
      (a, b) =>
        time(b.meta.date) - time(a.meta.date) ||
        version(b.meta).localeCompare(version(a.meta), undefined, { numeric: true })
    )

  return changelogs
}

// Roadmap functions
export function getAllRoadmapLessons(): RoadmapContent[] {
  const roadmapDir = path.join(contentDir, 'roadmap')

  if (!fs.existsSync(roadmapDir)) {
    return []
  }

  // Sorted so course order does not depend on the file system's directory order.
  const files = fs.readdirSync(roadmapDir).sort()

  const lessons = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(roadmapDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        meta: data as RoadmapMeta,
        content,
        slug,
      }
    })
    .sort((a, b) => a.meta.order - b.meta.order)

  return lessons
}

export function getRoadmapLessonBySlug(slug: string): RoadmapContent | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  try {
    const fullPath = path.join(contentDir, 'roadmap', `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      meta: data as RoadmapMeta,
      content,
      slug,
    }
  } catch {
    return null
  }
}

/** Courses in first-lesson order with their lessons' slugs and front matter only, never the bodies. */
export function getRoadmapIndex(): { course: string; lessons: Omit<RoadmapContent, 'content'>[] }[] {
  const courses = new Map<string, Omit<RoadmapContent, 'content'>[]>()

  for (const { slug, meta } of getAllRoadmapLessons()) {
    courses.set(meta.course, [...(courses.get(meta.course) ?? []), { slug, meta }])
  }

  return Array.from(courses, ([course, lessons]) => ({ course, lessons }))
}
