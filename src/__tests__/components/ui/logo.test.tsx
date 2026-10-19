import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Logo } from '@/components/ui/logo'
import { LOGO_ART } from '@/components/ui/logo-art'

describe('Logo', () => {
  it('draws the mini glyph in currentColor and hides it when unlabelled', () => {
    const { container } = render(<Logo variant="mini" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    const paths = svg.querySelectorAll('path')
    expect(paths).toHaveLength(1)
    expect(paths[0]).toHaveAttribute('d', LOGO_ART.glyph)
  })

  it('adds the orange crop marks to the labelled mark', () => {
    render(<Logo variant="mark" label="Rizky Haksono" />)
    const svg = screen.getByRole('img', { name: 'Rizky Haksono' })
    expect(svg).toHaveAttribute('viewBox', '-4 0 72 64')
    const paths = svg.querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('d', LOGO_ART.glyph)
    expect(paths[1]).toHaveAttribute('d', LOGO_ART.marks)
    expect(paths[1]).toHaveClass('stroke-mark')
  })

  it('reverses the glyph out of an ink tile', () => {
    const { container } = render(<Logo variant="tile" />)
    expect(container.querySelector('rect')).toHaveClass('fill-ink')
    const glyph = container.querySelector('path')
    expect(glyph).toHaveClass('fill-paper')
    expect(glyph).toHaveAttribute('d', LOGO_ART.glyph)
  })
})
