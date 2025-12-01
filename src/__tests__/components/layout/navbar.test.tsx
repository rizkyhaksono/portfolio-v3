import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '@/components/layout/navbar'

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'Link'
  return MockLink
})

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/',
  })),
  usePathname: jest.fn(() => '/'),
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, onMouseMove, onMouseLeave, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useMotionValue: jest.fn(() => ({
    get: jest.fn(() => Infinity),
    set: jest.fn(),
  })),
  useSpring: jest.fn((value) => value),
  useTransform: jest.fn((value, input, output) => value),
}))

jest.mock('@/components/layout/mobile-navbar-expand', () => {
  return function MockMobileNavbarExpand({ onItemClick }: { onItemClick: () => void }) {
    return <div data-testid="mobile-navbar-expand">Mobile Menu</div>
  }
})

describe('Navbar Component', () => {
  describe('Navigation Links', () => {
    it('should render all navigation links when user is not authenticated', () => {
      render(<Navbar isHaveToken={false} />)

      const links = screen.getAllByRole('link')
      const hrefs = links.map(link => link.getAttribute('href'))

      expect(hrefs).toContain('/')
      expect(hrefs).toContain('/project')
      expect(hrefs).toContain('/blog')
      expect(hrefs).toContain('/auth')
    })

    it('should render navigation links with correct hrefs', () => {
      render(<Navbar isHaveToken={false} />)

      const links = screen.getAllByRole('link')
      const homeLink = links.find(link => link.getAttribute('href') === '/')
      const projectLink = links.find(link => link.getAttribute('href') === '/project')
      const blogLink = links.find(link => link.getAttribute('href') === '/blog')
      const loginLink = links.find(link => link.getAttribute('href') === '/auth')

      expect(homeLink).toBeInTheDocument()
      expect(projectLink).toBeInTheDocument()
      expect(blogLink).toBeInTheDocument()
      expect(loginLink).toBeInTheDocument()
    })

    it('should show Profile link when user is authenticated', () => {
      render(<Navbar isHaveToken={true} />)

      const links = screen.getAllByRole('link')
      const profileLink = links.find(link => link.getAttribute('href') === '/profile')

      expect(profileLink).toBeInTheDocument()
    })

    it('should show Login link when user is not authenticated', () => {
      render(<Navbar isHaveToken={false} />)

      const links = screen.getAllByRole('link')
      const loginLink = links.find(link => link.getAttribute('href') === '/auth')

      expect(loginLink).toBeInTheDocument()
    })

    it('should not show auth link when authenticated', () => {
      render(<Navbar isHaveToken={true} />)

      const links = screen.getAllByRole('link')
      const authLink = links.find(link => link.getAttribute('href') === '/auth')

      expect(authLink).toBeUndefined()
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should render expand button', () => {
      render(<Navbar isHaveToken={false} />)

      const expandButton = screen.getByRole('button')
      expect(expandButton).toBeInTheDocument()
    })

    it('should toggle expanded state when expand button is clicked', async () => {
      const user = userEvent.setup()
      render(<Navbar isHaveToken={false} />)

      const expandButton = screen.getByRole('button')

      expect(screen.queryByTestId('mobile-navbar-expand')).not.toBeInTheDocument()

      await user.click(expandButton)

      expect(screen.queryAllByTestId('mobile-navbar-expand').length).toBeGreaterThan(0)
    })
  })

  describe('Component Structure', () => {
    it('should render with proper dock structure', () => {
      const { container } = render(<Navbar isHaveToken={false} />)

      const dock = container.querySelector('[class*="rounded-full"]')
      expect(dock).toBeInTheDocument()
    })

    it('should render separator between navigation and expand button', () => {
      const { container } = render(<Navbar isHaveToken={false} />)

      const separator = container.querySelector('[data-orientation="vertical"]')
      expect(separator).toBeInTheDocument()
    })

    it('should have 4 navigation links', () => {
      render(<Navbar isHaveToken={false} />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(4)
    })
  })
})
