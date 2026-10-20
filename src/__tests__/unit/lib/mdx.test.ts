import fs from 'fs'
import path from 'path'
import { getAllChangelogs } from '@/lib/mdx'

const dir = path.join(process.cwd(), 'content', 'changelog')

/** Serves `files` (name -> front matter lines) as the changelog folder, in the order given; every other path hits the real fs. */
function mockChangelogFolder(files: Record<string, string[]>) {
  const existsSync = fs.existsSync
  const readdirSync = fs.readdirSync
  const readFileSync = fs.readFileSync
  jest.spyOn(fs, 'existsSync').mockImplementation((p) => (p === dir ? true : existsSync(p)))
  jest.spyOn(fs, 'readdirSync').mockImplementation(((p: fs.PathLike, ...rest: unknown[]) =>
    p === dir ? Object.keys(files) : (readdirSync as (...args: unknown[]) => unknown)(p, ...rest)) as typeof fs.readdirSync)
  jest.spyOn(fs, 'readFileSync').mockImplementation(((p: fs.PathOrFileDescriptor, ...rest: unknown[]) => {
    const name = typeof p === 'string' && path.dirname(p) === dir ? path.basename(p) : undefined
    return name ? `---\n${files[name].join('\n')}\n---\nBody` : (readFileSync as (...args: unknown[]) => unknown)(p, ...rest)
  }) as typeof fs.readFileSync)
}

const entry = (date: string, version: string) => [`title: "${version}"`, `date: "${date}"`, `version: "${version}"`]
const versions = () => getAllChangelogs().map(({ meta }) => String(meta.version))

afterEach(() => jest.restoreAllMocks())

describe('getAllChangelogs order', () => {
  it('puts the newer date first whatever the version', () => {
    mockChangelogFolder({ 'a.mdx': entry('2026-10-19', '9.0.0'), 'b.mdx': entry('2026-10-20', '1.0.0') })

    expect(versions()).toEqual(['1.0.0', '9.0.0'])
  })

  it('breaks a date tie by version, newest first, even when the older release is read first', () => {
    mockChangelogFolder({ '2026-10-20.mdx': entry('2026-10-20', '1.6.0'), '2026-10-20-one-ink.mdx': entry('2026-10-20', '1.7.0') })

    expect(versions()).toEqual(['1.7.0', '1.6.0'])
  })

  it('compares versions as numbers, so 1.10.0 beats 1.9.0', () => {
    mockChangelogFolder({ 'a.mdx': entry('2026-10-20', '1.9.0'), 'b.mdx': entry('2026-10-20', '1.10.0') })

    expect(versions()).toEqual(['1.10.0', '1.9.0'])
  })

  it('does not throw on a missing or numeric version, or an invalid date', () => {
    mockChangelogFolder({
      'none.mdx': ['title: "none"', 'date: "2026-10-20"'],
      'number.mdx': ['title: "number"', 'date: "2026-10-20"', 'version: 1.7'],
      'semver.mdx': entry('2026-10-20', '1.6.0'),
      'bad-date.mdx': ['title: "bad"', 'date: "not a date"', 'version: "9.9.9"'],
    })

    const titles = () => getAllChangelogs().map(({ meta }) => meta.title)

    expect(titles).not.toThrow()
    expect(titles()).toEqual(['number', '1.6.0', 'none', 'bad'])
  })
})
