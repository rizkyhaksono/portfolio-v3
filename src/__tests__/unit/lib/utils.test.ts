import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should handle conditional class names', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
    expect(result).toBe('base-class conditional-class')
  })

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('px-4', 'px-6')
    expect(result).toBe('px-6')
  })

  it('should handle empty strings and undefined', () => {
    const result = cn('px-4', '', undefined, 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should handle arrays of class names', () => {
    const result = cn(['px-4', 'py-2'], 'bg-blue-500')
    expect(result).toBe('px-4 py-2 bg-blue-500')
  })

  it('should handle objects with boolean values', () => {
    const result = cn({
      'px-4': true,
      'py-2': true,
      'hidden': false,
    })
    expect(result).toBe('px-4 py-2')
  })

  it('should return empty string when no arguments provided', () => {
    const result = cn()
    expect(result).toBe('')
  })
})
