import { render, screen } from '@testing-library/react'
import { TitleBlock } from '@/components/layout/title-block'
import { JOB_TITLE } from '@/commons/constants/author'
import { getAllChangelogs } from '@/lib/mdx'
import '@testing-library/jest-dom'

const LABELS = ['Drawn by', 'Role', 'Location', 'Revision', 'Set in', 'Contact']

const valueOf = (label: string) => screen.getByText(label, { selector: 'dt' }).nextElementSibling

describe('TitleBlock', () => {
  it('labels every cell with a dt', () => {
    render(<TitleBlock />)
    expect(screen.getAllByRole('term').map((dt) => dt.textContent)).toEqual(LABELS)
  })

  it('states the revision as the newest changelog version and date', () => {
    const { version, date } = getAllChangelogs()[0].meta
    render(<TitleBlock />)
    expect(valueOf('Revision')).toHaveTextContent(`${version}, ${date}`)
  })

  it('fills the other cells with real values', () => {
    render(<TitleBlock />)
    expect(valueOf('Drawn by')).toHaveTextContent('Rizky Haksono')
    expect(valueOf('Role')).toHaveTextContent(`${JOB_TITLE}, Sarana AI`)
    expect(valueOf('Location')).toHaveTextContent('Malang, East Java')
    expect(valueOf('Set in')).toHaveTextContent('IBM Plex Sans and IBM Plex Mono')
  })

  it('links the contact to a tracked mailto address', () => {
    render(<TitleBlock />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toMatch(/^mailto:.+@.+/)
    expect(link).toHaveAttribute('data-track', 'email-click')
    expect(link).toHaveAttribute('data-track-area', 'colophon')
    expect(valueOf('Contact')).toContainElement(link)
  })
})
