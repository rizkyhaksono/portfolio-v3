/**
 * @jest-environment node
 */
import type { ReactNode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import Home from '@/app/page'
import { getAllProject } from '@/services/visitor/project'
import { EMAIL } from '@/commons/constants/contact'

jest.mock('@/components/layout/base-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}))
jest.mock('@/app/_components/contact/contact-form', () => ({ ContactForm: () => <form aria-label="Message" /> }))

const project = (id: string, title: string) => ({
  id,
  title,
  description: `${title} does one thing well. A second sentence that stays off the home page.`,
  url: '',
  created_at: `2025-01-0${id.slice(1)}`,
  updated_at: '',
  image: null,
  source_code: null,
})
const PROJECTS = [project('p1', 'Info Pangan Jakarta'), ...Array.from({ length: 8 }, (_, i) => project(`p${i + 2}`, `Tool ${i + 2}`))]

jest.mock('@/services/visitor/project', () => ({ getAllProject: jest.fn() }))
jest.mock('@/services/visitor/career', () => ({
  getAllCarrer: jest.fn().mockResolvedValue([
    { id: 'c1', title: 'Senior AI Engineer', subtitle: 'Sarana AI', duration: 'Jan 2025 - Present', image: null },
    { id: 'c2', title: 'Backend Engineer', subtitle: 'Adaro', duration: 'Mar 2022 - Dec 2022', image: null },
  ]),
}))
jest.mock('@/services/visitor/education', () => ({
  getAllEducation: jest.fn().mockResolvedValue([
    { id: 'e1', title: 'Informatics', subtitle: 'Universitas Muhammadiyah Malang', duration: 'Aug 2020 - Aug 2024', image: null },
  ]),
}))
jest.mock('@/services/visitor/linkedin', () => ({ getLinkedinRecommendations: jest.fn().mockResolvedValue({ data: [] }) }))
jest.mock('@/app/_components/blog/posts', () => ({
  getPosts: jest.fn().mockResolvedValue([
    { id: 'dev-1', title: 'Shipping RAG', excerpt: 'Retrieval in production. More later.', href: '/blog/shipping-rag', source: 'dev', date: null },
  ]),
}))

/** The page as the server sends it, after every Suspense section has resolved. */
async function renderHome() {
  const { prelude } = await prerenderToNodeStream(<Home />)
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html.replaceAll('<!-- -->', '')
}

describe('Home page', () => {
  beforeEach(() => jest.mocked(getAllProject).mockResolvedValue(PROJECTS))

  it('reads as Josh-style text lists: bio, projects, writing, every work entry and contact', async () => {
    const html = await renderHome()

    expect(html).toMatch(/<h1[^>]*>Rizky Haksono<\/h1>/)
    expect(html).toContain('Senior AI engineer at')
    for (const heading of ['Projects', 'Writing', 'Work experience', 'Contact']) {
      expect(html).toMatch(new RegExp(`<h2[^>]*>${heading}</h2>`))
    }

    expect(html).toContain('href="/project/p1"')
    expect(html).toContain('Info Pangan Jakarta does one thing well.')
    expect(html).not.toContain('A second sentence that stays off the home page')
    expect(html).toContain('All 9 projects')

    expect(html).toContain('href="/blog/shipping-rag"')
    expect(html).toContain('Shipping RAG')

    // Every career and education entry, newest first.
    const order = ['Senior AI Engineer', 'Backend Engineer', 'Informatics'].map((title) => html.indexOf(title))
    expect(order.every((at) => at > 0)).toBe(true)
    expect(order).toEqual([...order].sort((a, b) => a - b))

    expect(html).toContain(`href="mailto:${EMAIL}"`)
    expect(html).not.toContain('Recommendations')
  })

  it('says so honestly when the projects fail to load', async () => {
    jest.mocked(getAllProject).mockRejectedValue(new Error('timeout'))
    const html = await renderHome()
    expect(html).toContain('Projects did not load just now')
    expect(html).toContain('Writing')
  })
})
