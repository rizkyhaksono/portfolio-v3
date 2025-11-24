# Portfolio v3

> Modern portfolio website built with Next.js 16, React 19, TypeScript, and Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)

## 📖 Overview

This is my third iteration of my personal portfolio website, showcasing my work as a software engineer. Built with cutting-edge technologies and modern web development practices, this project demonstrates my skills in full-stack development, UI/UX design, and software architecture.

**Live Site:** [nateee.com](https://nateee.com)

## 🚀 Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Turbopack](https://turbo.build/pack)** - Ultra-fast bundler for development

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix UI
- **[Magic UI](https://magicui.design/)** - Beautiful animated components
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Backend & Database
- **[Supabase](https://supabase.com/)** - PostgreSQL database and authentication
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolvers

### Content Management
- **[MDX](https://mdxjs.com/)** - Markdown with JSX components
- **[gray-matter](https://github.com/jonschlinkert/gray-matter)** - YAML front matter parser
- **[next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)** - Load MDX content
- **[highlight.js](https://highlightjs.org/)** - Syntax highlighting

### 3D Graphics
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Useful helpers for R3F

### Testing
- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[React Testing Library](https://testing-library.com/)** - Component testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing

### Developer Experience
- **[ESLint](https://eslint.org/)** - Code linting
- **[Vercel Analytics](https://vercel.com/analytics)** - Web analytics

## 🏗️ Architecture

### Next.js App Router Structure

This project uses **Next.js 16 App Router** with route groups for logical organization:

```
src/app/
├── (visitor)/          # Public visitor pages
├── (user)/             # Authenticated user pages
├── (admin)/            # Admin dashboard
├── (authentication)/   # Auth-related pages
├── _components/        # Shared page components
├── actions/            # Server actions
├── api/                # API routes
└── layout.tsx          # Root layout
```

### Project Structure

```
portfolio-v3/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (visitor)/          # Public routes (home, blog, projects)
│   │   ├── (user)/             # Protected user routes
│   │   ├── (admin)/            # Admin dashboard routes
│   │   ├── (authentication)/   # Auth routes (login, register)
│   │   ├── _components/        # Page-specific components
│   │   ├── actions/            # Server actions
│   │   └── api/                # API routes
│   │
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── magicui/            # Magic UI components
│   │   └── layout/             # Layout components
│   │
│   ├── commons/                # Shared utilities
│   │   ├── constants/          # App constants
│   │   ├── helpers/            # Helper functions
│   │   └── types/              # TypeScript types
│   │
│   ├── services/               # API service layer
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Library configurations
│   ├── supabase/               # Supabase client
│   └── middleware.ts           # Next.js middleware
│
├── __tests__/                  # Test files
│   ├── e2e/                    # End-to-end tests
│   └── README.md               # Testing documentation
│
├── public/                     # Static assets
├── content/                    # MDX content files
└── misc/                       # Miscellaneous files
```

### Design Patterns

#### Component Architecture
- **Atomic Design**: Components organized from atoms to organisms
- **Composition over Inheritance**: Flexible component composition
- **Server & Client Components**: Optimized for React Server Components

#### State Management
- **React Hooks**: useState, useEffect for local state
- **Server Actions**: Form submissions and mutations
- **Theme Provider**: Global theme state with next-themes

#### Data Fetching
- **Server Components**: Data fetched on the server by default
- **Supabase Client**: Direct database queries
- **API Routes**: RESTful endpoints for external integrations

## ✨ Features

### Visitor Features
- 🏠 **Portfolio Showcase** - Projects, skills, and experience
- 📝 **Blog** - Technical blog with MDX support
- 🌓 **Dark Mode** - System-aware theme switching
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Performance** - Optimized with Next.js 16
- 🎨 **Animations** - Smooth Framer Motion animations
- 🔍 **SEO Optimized** - Meta tags, sitemap, robots.txt

### Admin Features
- 🔐 **Authentication** - Supabase Auth with protected routes
- 📊 **Dashboard** - Analytics and content management
- ✏️ **Content Editor** - Create and edit blog posts
- 👥 **Visitor Tracking** - See who visited your portfolio
- 💬 **LinkedIn Recommendations** - Display recommendations

### Developer Features
- 🧪 **Testing Suite** - Unit, component, and E2E tests
- 📏 **Type Safety** - Full TypeScript coverage
- 🔄 **Hot Reload** - Instant feedback with Turbopack
- 🎯 **Linting** - ESLint configuration
- 📦 **Modern Tooling** - Latest web technologies

## 🛠️ Installation

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun
- Supabase account (for database)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Domain
DOMAIN=https://your-domain.com

# Email (optional for contact form)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key

# Cloudflare Turnstile (optional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
```

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rizkyhaksono/portfolio-v3.git
   cd portfolio-v3
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Run database migrations** (if applicable)
   ```bash
   # Follow Supabase documentation for migrations
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

This project includes comprehensive testing using Jest, React Testing Library, and Playwright.

### Running Tests

```bash
# Run all unit and component tests
npm run test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run end-to-end tests with Playwright
npm run test:e2e

# Run E2E tests with interactive UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

### Test Structure

- **Unit Tests** - Testing utility functions (`src/__tests__/unit/`)
- **Component Tests** - Testing React components (`src/__tests__/components/`)
- **Integration Tests** - Testing page-level functionality (`src/__tests__/integration/`)
- **E2E Tests** - End-to-end browser testing (`__tests__/e2e/`)

### Test Coverage

- ✅ Utility functions (cn helper)
- ✅ UI components (Button, etc.)
- ✅ Layout components
- ✅ Page navigation and routing
- ✅ Theme switching functionality

For detailed testing documentation, see [__tests__/README.md](./__tests__/README.md).

## 📜 Available Scripts

```json
{
  "dev": "next dev --turbopack",          // Start development server with Turbopack
  "build": "next build",                   // Build for production
  "start": "next start --port 3001",       // Start production server
  "lint": "next lint",                     // Run ESLint
  "test": "jest",                          // Run unit tests
  "test:watch": "jest --watch",            // Run tests in watch mode
  "test:coverage": "jest --coverage",      // Generate coverage report
  "test:e2e": "playwright test",           // Run E2E tests
  "test:e2e:ui": "playwright test --ui",   // Run E2E with UI
  "test:e2e:debug": "playwright test --debug" // Debug E2E tests
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

This project can be deployed to any platform that supports Next.js:
- **Netlify**
- **Railway**
- **AWS Amplify**
- **DigitalOcean App Platform**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👤 Author

**Muhammad Rizky Haksono**

- Website: [nateee.com](https://nateee.com)
- GitHub: [@rizkyhaksono](https://github.com/rizkyhaksono)
- LinkedIn: [rizkyhaksono](https://www.linkedin.com/in/rizkyhaksono)
- Email: mrizkyhaksono@gmail.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Vercel](https://vercel.com/) - Deployment platform
- [Supabase](https://supabase.com/) - Backend as a service

---

<div align="center">
  Made with ❤️ by Rizky Haksono
</div>
