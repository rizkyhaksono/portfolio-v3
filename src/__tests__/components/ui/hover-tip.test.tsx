import { fireEvent, render, screen } from '@testing-library/react'
import { HoverTip } from '@/components/ui/hover-tip'
import '@testing-library/jest-dom'

const tip = () => document.querySelector<HTMLDivElement>('[aria-hidden].fixed')!

describe('HoverTip', () => {
  it('shows a data-tip on pointer over at once and hides it when the pointer leaves', () => {
    render(
      <>
        <HoverTip />
        <button type="button" aria-label="Night theme" data-tip="Switch to night" />
        <p>Elsewhere</p>
      </>,
    )
    expect(tip()).not.toBeVisible()

    fireEvent.pointerOver(screen.getByRole('button'))
    expect(tip()).toBeVisible()
    expect(tip()).toHaveTextContent('Switch to night')

    fireEvent.pointerOut(screen.getByRole('button'), { relatedTarget: screen.getByText('Elsewhere') })
    expect(tip()).not.toBeVisible()
  })

  it('hides on Escape', () => {
    render(
      <>
        <HoverTip />
        <button type="button" aria-label="Bold" data-tip="Bold" />
      </>,
    )
    fireEvent.pointerOver(screen.getByRole('button'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(tip()).not.toBeVisible()
  })
})
