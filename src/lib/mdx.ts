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

export interface RoadmapMeta {
  title: string
  description: string
  course: string
  category: string
  difficulty: string
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
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

  return changelogs
}

export function getChangelogBySlug(slug: string): ChangelogContent | null {
  try {
    const fullPath = path.join(contentDir, 'changelog', `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      meta: data as ChangelogMeta,
      content,
      slug,
    }
  } catch {
    return null
  }
}

// Roadmap functions
export function getAllRoadmapLessons(): RoadmapContent[] {
  const roadmapDir = path.join(contentDir, 'roadmap')

  if (!fs.existsSync(roadmapDir)) {
    return []
  }

  const files = fs.readdirSync(roadmapDir)

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

export function getRoadmapCourses() {
  const lessons = getAllRoadmapLessons()
  const courses = new Map<string, RoadmapContent[]>()

  lessons.forEach(lesson => {
    const course = lesson.meta.course
    if (!courses.has(course)) {
      courses.set(course, [])
    }
    courses.get(course)!.push(lesson)
  })

  return Array.from(courses.entries()).map(([course, lessons]) => ({
    course,
    lessons: lessons.sort((a, b) => a.meta.order - b.meta.order),
  }))
}
