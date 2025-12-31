# Portfolio v3

Modern portfolio website built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)

## Overview

This is my third iteration of my personal portfolio website, showcasing my work as a software engineer. Built with cutting-edge technologies and modern web development practices, this project demonstrates my skills in full-stack development, UI/UX design, and software architecture.

**Live Site:** [nateee.com](https://nateee.com)

## Tech Stack

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

### Testing

- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[React Testing Library](https://testing-library.com/)** - Component testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing

### Developer Experience

- **[ESLint](https://eslint.org/)** - Code linting
- **[Vercel Analytics](https://vercel.com/analytics)** - Web analytics

## Architecture

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

## Features

### For Visitors

- **Portfolio Showcase** - Projects, skills, and professional experience
- **Blog** - Technical writing with MDX support for rich content
- **Dark Mode** - Automatically adapts to your system preferences
- **Responsive Design** - Works seamlessly on all devices
- **Performance** - Lightning-fast page loads with Next.js 16
- **Smooth Animations** - Polished interactions using Framer Motion
- **SEO Optimized** - Proper meta tags, sitemap, and robots.txt

### For Admins

- **Authentication** - Secure login with Supabase Auth
- **Dashboard** - Analytics and content management in one place
- **Content Editor** - Easy blog post creation and editing
- **Visitor Tracking** - See who's checking out your portfolio
- **LinkedIn Integration** - Display your recommendations

### For Developers

- **Comprehensive Testing** - Unit, component, and end-to-end tests
- **Type Safety** - Full TypeScript coverage throughout
- **Hot Reload** - Instant feedback with Turbopack
- **Code Quality** - ESLint configuration included
- **Modern Stack** - Built with the latest web technologies

## Installation

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

## Testing

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

For detailed testing documentation, see [**tests**/README.md](./__tests__/README.md).

## API Endpoints

### Public Endpoints

#### GET `/api/ping`

Health check endpoint to verify server status.

**Response:**

```json
{
  "timestamp": "2025-12-16T10:30:00Z",
  "status": "ok",
  "uptime": 3600
}
```

#### GET `/api/spotify`

Fetch current Spotify playback information (requires Spotify API setup).

**Response:**

```json
{
  "isPlaying": true,
  "title": "Song Name",
  "artist": "Artist Name",
  "album": "Album Name",
  "albumArt": "https://...",
  "url": "https://open.spotify.com/track/..."
}
```

**Setup Required:**

- Spotify Client ID & Client Secret
- Add to environment variables: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`

#### GET `/api/weather`

Fetch weather information (requires weather API setup).

**Response:**

```json
{
  "temperature": 25,
  "condition": "Partly Cloudy",
  "humidity": 65,
  "windSpeed": 12,
  "location": "City Name"
}
```

**Setup Required:**

- Add weather API credentials to environment variables

## 📁 Service Layer

The service layer is organized by role/context:

### `/src/services/visitor/`

Public-facing services:

- **ping.ts** - Server health check
- **spotify.ts** - Spotify integration
- **weather.ts** - Weather data fetching

### `/src/services/user/`

User-authenticated services for logged-in users.

### `/src/services/admin/`

Admin-only services for dashboard and content management.

## 🗄️ Database Schema

### Supabase Tables

The project uses Supabase PostgreSQL. Key tables include:

**Example User Table:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Example Visitor Tracking Table:**

```sql
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

For your specific schema, check Supabase dashboard or migration files.

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled - utilize full type safety
- **File Naming**: Use kebab-case for files (e.g., `my-component.tsx`)
- **Components**: Use PascalCase for component names
- **Utilities**: Use camelCase for function/variable names

### Component Guidelines

1. **Folder Structure**:

   ```
   components/category/
   ├── component-name.tsx       # Component file
   ├── component-name.test.tsx  # Tests
   └── index.ts                 # Named export
   ```

2. **Server vs Client Components**:

   - Default to Server Components unless you need interactivity
   - Use `'use client'` directive only when necessary
   - Minimize client component boundaries

3. **Props & Typing**:

   ```typescript
   interface ComponentProps {
     title: string
     isActive?: boolean
     children: React.ReactNode
   }

   export function MyComponent({ title, isActive, children }: ComponentProps) {
     return <div>{children}</div>
   }
   ```

### Styling

- Use Tailwind CSS utility classes
- Create custom styles in `globals.css` only when necessary
- Leverage Shadcn/ui components for consistency
- Use CSS modules for scoped styles if needed: `styles.module.css`

### Error Handling

- Use Zod for schema validation
- Create typed error responses
- Log errors to monitoring service (Sentry, etc.)

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

#### Supabase Connection Issues

- Verify `.env` variables are set correctly
- Check Supabase project is active
- Ensure Row Level Security (RLS) policies allow your queries

#### Build Errors

```bash
# Clear build cache
rm -rf .next
npm run build
```

#### Tests Failing

```bash
# Clear Jest cache
npm run test -- --clearCache

# Run tests with verbose output
npm run test -- --verbose
```

### Hot Reload Not Working

- Check if Turbopack is running: `next dev --turbopack`
- Restart dev server
- Clear browser cache

## Performance Optimization

### Image Optimization

- Use Next.js `Image` component for automatic optimization
- Specify `width` and `height` props
- Use `priority` prop for above-the-fold images

### Code Splitting

- Next.js automatically code-splits at route level
- Use dynamic imports for heavy components:
  ```typescript
  import dynamic from "next/dynamic"
  const HeavyComponent = dynamic(() => import("./HeavyComponent"))
  ```

### Database Queries

- Use Supabase indexes for frequently queried columns
- Implement pagination for large result sets
- Consider caching strategies with `revalidate` options

## Security Considerations

### Environment Variables

- **Public Variables**: Use `NEXT_PUBLIC_` prefix only for truly public data
- **Secret Variables**: Keep database credentials, API keys secure
- Never commit `.env` files

### Authentication

- Use Supabase Auth for user management
- Implement RLS (Row Level Security) policies
- Validate all form inputs with Zod

### API Routes

- Validate request data
- Check user authentication/authorization
- Rate-limit sensitive endpoints using the helper in `commons/helpers/rate-limit.ts`

## Monitoring & Analytics

### Vercel Analytics

- Automatically enabled in production on Vercel
- Monitor Web Vitals, user interactions
- View dashboard at vercel.com

### Custom Tracking

- Implement tracking in `src/commons/helpers/`
- Log important events to database
- Track page views in `api/` routes

## Available Scripts

```json
{
  "dev": "next dev --turbopack", // Start development server with Turbopack
  "build": "next build", // Build for production
  "start": "next start --port 3001", // Start production server
  "lint": "next lint", // Run ESLint
  "test": "jest", // Run unit tests
  "test:watch": "jest --watch", // Run tests in watch mode
  "test:coverage": "jest --coverage", // Generate coverage report
  "test:e2e": "playwright test", // Run E2E tests
  "test:e2e:ui": "playwright test --ui", // Run E2E with UI
  "test:e2e:debug": "playwright test --debug" // Debug E2E tests
}
```

## Deployment

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

**Muhammad Rizky Haksono**

- Website: [nateee.com](https://nateee.com)
- GitHub: [@rizkyhaksono](https://github.com/rizkyhaksono)
- LinkedIn: [rizkyhaksono](https://www.linkedin.com/in/rizkyhaksono)
- Email: mrizkyhaksono@gmail.com

## Acknowledgments

Special thanks to the amazing tools and platforms that made this project possible:

- [Next.js](https://nextjs.org/) - The React framework that powers everything
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Vercel](https://vercel.com/) - Seamless deployment and hosting
- [Supabase](https://supabase.com/) - Powerful backend infrastructure

---

<div align="center">
  Made by Rizky Haksono
</div>
