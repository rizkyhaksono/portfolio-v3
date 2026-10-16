import { cn, safeRedirect } from '@/lib/utils'

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

describe('safeRedirect', () => {
  it('keeps same-origin paths', () => {
    expect(safeRedirect('/ai')).toBe('/ai')
    expect(safeRedirect('/blog/x?y=1')).toBe('/blog/x?y=1')
  })

  it('rejects external and protocol-relative targets', () => {
    for (const bad of [
      '//evil.com',
      '/\\evil.com',
      '/\t/evil.com',
      '/\n/evil.com',
      '/\r\n/evil.com',
      'https://evil.com',
      'ai',
      '',
      null,
      undefined,
    ]) {
      expect(safeRedirect(bad)).toBe('/')
    }
  })
})
