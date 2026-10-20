import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { PlateFigure } from '@/components/ui/plate-figure'

const frameOf = (container: HTMLElement) => container.querySelector('figure > div')!

describe('PlateFigure', () => {
  it('prints a photo as a duotone plate inside the double-rule frame', () => {
    const { container } = render(
      <PlateFigure>
        <img src="/x.jpg" alt="" />
      </PlateFigure>,
    )
    expect(frameOf(container)).toHaveClass('border', 'border-ink')
    expect(frameOf(container).querySelector('.plate img')).toBeInTheDocument()
  })

  it('keeps the picture in colour when the tone is color', () => {
    const { container } = render(
      <PlateFigure tone="color">
        <img src="/x.jpg" alt="" />
      </PlateFigure>,
    )
    expect(container.querySelector('.plate')).toBeNull()
    expect(container.querySelector('img')).toBeInTheDocument()
  })

  it('outlines the whole frame in ink when a control inside is keyboard-focused, since the photo clips its own outline', () => {
    const { container } = render(
      <PlateFigure>
        <button type="button">Open</button>
      </PlateFigure>,
    )
    expect(frameOf(container)).toHaveClass(
      'has-[:focus-visible]:outline',
      'has-[:focus-visible]:outline-2',
      'has-[:focus-visible]:outline-offset-2',
      'has-[:focus-visible]:outline-ring',
    )
  })
})
