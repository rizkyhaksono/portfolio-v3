import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { InkLink } from '@/components/ui/ink-link'
import { Pager } from '@/components/ui/pager'

describe('InkLink', () => {
  it('opens external links safely and tracks them with Umami', () => {
    render(<InkLink href="https://github.com/rizkyhaksono" external eventData={{ area: 'contact' }}>GitHub</InkLink>)
    const link = screen.getByRole('link', { name: 'GitHub (opens in a new tab)' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('data-umami-event', 'outbound-click')
    expect(link).toHaveAttribute('data-umami-event-host', 'github.com')
    expect(link).toHaveAttribute('data-umami-event-area', 'contact')
  })

  it('names an external link with its own event instead of outbound-click', () => {
    render(<InkLink href="mailto:hi@natee.my.id" external event="email-click">Email</InkLink>)
    const link = screen.getByRole('link', { name: 'Email (opens in a new tab)' })
    expect(link).toHaveAttribute('data-umami-event', 'email-click')
    expect(link).not.toHaveAttribute('data-umami-event-host')
  })

  // Umami reloads the page for same-tab links it tracks, so internal links must never carry data-umami-event.
  it('tracks internal links through data-track only', () => {
    render(<InkLink href="/blog" event="nav-click" eventData={{ item: 'blog' }}>Writing</InkLink>)
    const link = screen.getByRole('link', { name: 'Writing' })
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('data-umami-event')
    expect(link).toHaveAttribute('data-track', 'nav-click')
    expect(link).toHaveAttribute('data-track-item', 'blog')
  })
})

describe('Pager', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(<Pager page={1} totalPages={1} onPage={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('disables Previous on the first page', () => {
    render(<Pager page={1} totalPages={3} onPage={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })
})
