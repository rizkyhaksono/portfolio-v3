import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { PlateFigure } from '@/components/ui/plate-figure'

const frameOf = (container: HTMLElement) => container.querySelector('figure > div')!

describe('PlateFigure', () => {
  it('sets the picture on the grey tile with soft corners', () => {
    const { container } = render(
      <PlateFigure caption="Info Pangan Jakarta">
        <img src="/x.jpg" alt="" />
      </PlateFigure>,
    )
    expect(frameOf(container)).toHaveClass('rounded-lg', 'bg-muted', 'overflow-hidden')
    expect(frameOf(container)).not.toHaveClass('border-foreground')
    expect(frameOf(container).querySelector('img')).toBeInTheDocument()
    expect(container.querySelector('figcaption')).toHaveTextContent('Info Pangan Jakarta')
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
