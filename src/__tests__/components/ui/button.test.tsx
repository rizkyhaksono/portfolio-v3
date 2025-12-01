import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '@/components/ui/button'
import '@testing-library/jest-dom'

describe('Button Component', () => {
  it('renders a button with default variant', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('handles onClick events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    button.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button', { name: /custom/i })
    expect(button).toHaveClass('custom-class')
  })
})

describe('buttonVariants', () => {
  it('generates correct classes for default variant', () => {
    const classes = buttonVariants()
    expect(classes).toContain('bg-primary')
  })

  it('generates correct classes for destructive variant', () => {
    const classes = buttonVariants({ variant: 'destructive' })
    expect(classes).toContain('bg-destructive')
  })

  it('generates correct classes for outline variant', () => {
    const classes = buttonVariants({ variant: 'outline' })
    expect(classes).toContain('border')
  })

  it('generates correct classes for small size', () => {
    const classes = buttonVariants({ size: 'sm' })
    expect(classes).toContain('h-8')
  })
})
