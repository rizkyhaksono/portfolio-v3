import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { PlateFigure } from '@/components/ui/plate-figure'

describe('PlateFigure', () => {
  it('prints a photo in grayscale with four crop marks on the frame', () => {
    const { container } = render(
      <PlateFigure>
        <img src="/x.jpg" alt="" />
      </PlateFigure>,
    )
    expect(container.querySelector('.plate')).toBeInTheDocument()
    const marks = container.querySelectorAll('[data-crop]')
    expect(marks).toHaveLength(4)
    marks.forEach((mark) => expect(mark).toHaveAttribute('aria-hidden', 'true'))
    expect(container.querySelector('.plate [data-crop]')).toBeNull()
  })

  it('keeps colour when the tone is color, and still draws the marks', () => {
    const { container } = render(
      <PlateFigure tone="color">
        <img src="/x.jpg" alt="" />
      </PlateFigure>,
    )
    expect(container.querySelector('.plate')).toBeNull()
    expect(container.querySelectorAll('[data-crop]')).toHaveLength(4)
  })

  it('sets the caption upright', () => {
    render(
      <PlateFigure caption="A caption">
        <img src="/x.jpg" alt="" />
      </PlateFigure>,
    )
    expect(screen.getByText('A caption').className).not.toMatch(/italic/)
  })
})
