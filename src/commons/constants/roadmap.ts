import { Roadmap } from "../types/roadmap";

export const roadmaps_data: Roadmap[] = [
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Learn the core concepts of React and build your first components",
    level: "beginner",
    category: "frontend",
    totalRoadmap: 12,
    completedRoadmap: 5,
    modules: [
      {
        id: "module-1",
        title: "Getting Started with React",
        description: "Introduction to React and setting up your development environment",
        duration: "1.5 hours",
        roadmaps: [
          {
            id: "lesson-1-1",
            title: "What is React?",
            slug: "what-is-react",
            description: "Understanding React's core philosophy and component model",
            duration: "10 min",
            completed: true
          },
          {
            id: "lesson-1-2",
            title: "Setting Up Your Environment",
            slug: "setup-environment",
            description: "Installing Node.js, npm, and creating your first React app",
            duration: "15 min",
            completed: true
          },
          {
            id: "lesson-1-3",
            title: "JSX Syntax",
            slug: "jsx-syntax",
            description: "Learning the JSX syntax and how it differs from HTML",
            duration: "20 min",
            completed: true
          }
        ]
      },
      {
        id: "module-2",
        title: "React Components",
        description: "Creating functional and class components in React",
        duration: "2 hours",
        roadmaps: [
          {
            id: "lesson-2-1",
            title: "Functional Components",
            slug: "functional-components",
            description: "Creating and using functional components in React",
            duration: "20 min",
            completed: true
          },
          {
            id: "lesson-2-2",
            title: "Class Components",
            slug: "class-components",
            description: "Understanding class components and their lifecycle methods",
            duration: "25 min",
            completed: true
          },
          {
            id: "lesson-2-3",
            title: "Props and State",
            slug: "props-and-state",
            description: "Managing data with props and state in React components",
            duration: "30 min"
          }
        ]
      },
      {
        id: "module-3",
        title: "Hooks and Advanced Concepts",
        description: "Using React Hooks and understanding advanced React patterns",
        duration: "2.5 hours",
        roadmaps: [
          {
            id: "lesson-3-1",
            title: "useState Hook",
            slug: "usestate-hook",
            description: "Managing state in functional components with useState",
            duration: "20 min"
          },
          {
            id: "lesson-3-2",
            title: "useEffect Hook",
            slug: "useeffect-hook",
            description: "Handling side effects in React components",
            duration: "25 min"
          },
          {
            id: "lesson-3-3",
            title: "Custom Hooks",
            slug: "custom-hooks",
            description: "Creating your own custom hooks for reusable logic",
            duration: "30 min"
          }
        ]
      }
    ]
  },
  {
    id: "nextjs-masterclass",
    title: "Next.js Masterclass",
    description: "Build production-ready applications with Next.js",
    level: "intermediate",
    category: "frontend",
    totalRoadmap: 10,
    completedRoadmap: 0,
    modules: [
      {
        id: "module-1",
        title: "Next.js Foundations",
        description: "Core concepts of Next.js and project setup",
        duration: "2 hours",
        roadmaps: [
          {
            id: "lesson-1-1",
            title: "Introduction to Next.js",
            slug: "intro-to-nextjs",
            description: "Understanding what makes Next.js different from React",
            duration: "15 min"
          },
          {
            id: "lesson-1-2",
            title: "Routing in Next.js",
            slug: "nextjs-routing",
            description: "File-based routing system and navigation between pages",
            duration: "25 min"
          }
        ]
      }
    ]
  },
  {
    id: "expressjs-essentials",
    title: "Express.js Essentials",
    description: "Build RESTful APIs with Express.js",
    level: "beginner",
    category: "backend",
    totalRoadmap: 8,
    completedRoadmap: 0,
    modules: [
      {
        id: "module-1",
        title: "Getting Started with Express.js",
        description: "Setting up your first Express.js server",
        duration: "1 hour",
        roadmaps: [
          {
            id: "lesson-1-1",
            title: "Introduction to Express.js",
            slug: "intro-to-express",
            description: "Understanding the basics of Express.js and its middleware",
            duration: "15 min"
          },
          {
            id: "lesson-1-2",
            title: "Creating Your First Server",
            slug: "create-first-server",
            description: "Setting up a simple Express server and handling requests",
            duration: "20 min"
          }
        ]
      }
    ]
  }
];