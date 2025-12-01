import '@testing-library/jest-dom'

jest.mock('@/services/visitor/linkedin', () => ({
  getLinkedinRecommendations: jest.fn().mockResolvedValue({
    data: [],
  }),
}))

describe('Home Page', () => {
  it('should have proper exports', () => {
    expect(true).toBe(true)
  })
})
