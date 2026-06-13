import fs from "fs"
import path from "path"

const roadmapDir = path.join(process.cwd(), "content", "roadmap")

const lessons = [
  // express-fundamentals
  { slug: "express-fundamentals-intermediate-error-handling", course: "express-fundamentals", category: "backend", level: "intermediate", difficulty: "intermediate", order: 4, title: "Error Handling in Express", description: "Centralized error handling, custom error classes, and async error patterns", duration: "18 min" },
  { slug: "express-fundamentals-intermediate-jwt-auth", course: "express-fundamentals", category: "backend", level: "intermediate", difficulty: "intermediate", order: 5, title: "JWT Authentication", description: "Implement secure authentication with JSON Web Tokens and middleware guards", duration: "22 min" },
  { slug: "express-fundamentals-intermediate-database-integration", course: "express-fundamentals", category: "backend", level: "intermediate", difficulty: "intermediate", order: 6, title: "Database Integration", description: "Connect Express to PostgreSQL with Prisma ORM and repository patterns", duration: "25 min" },
  { slug: "express-fundamentals-advanced-performance-caching", course: "express-fundamentals", category: "backend", level: "advanced", difficulty: "advanced", order: 7, title: "Performance & Caching", description: "Redis caching, compression, rate limiting, and response optimization", duration: "20 min" },
  { slug: "express-fundamentals-advanced-microservices", course: "express-fundamentals", category: "backend", level: "advanced", difficulty: "advanced", order: 8, title: "Microservices Architecture", description: "Split monoliths into services with API gateways and inter-service communication", duration: "28 min" },
  { slug: "express-fundamentals-advanced-testing-deployment", course: "express-fundamentals", category: "backend", level: "advanced", difficulty: "advanced", order: 9, title: "Testing & Deployment", description: "Integration tests with Supertest, CI/CD pipelines, and production deployment", duration: "24 min" },

  // react-fundamentals
  { slug: "react-fundamentals-intermediate-state-management", course: "react-fundamentals", category: "frontend", level: "intermediate", difficulty: "intermediate", order: 4, title: "State Management Patterns", description: "Context API, useReducer, and when to reach for external state libraries", duration: "20 min" },
  { slug: "react-fundamentals-intermediate-hooks-deep-dive", course: "react-fundamentals", category: "frontend", level: "intermediate", difficulty: "intermediate", order: 5, title: "Hooks Deep Dive", description: "Custom hooks, useEffect cleanup, useMemo, useCallback, and performance hooks", duration: "25 min" },
  { slug: "react-fundamentals-intermediate-react-router", course: "react-fundamentals", category: "frontend", level: "intermediate", difficulty: "intermediate", order: 6, title: "React Router", description: "Client-side routing, nested routes, loaders, and protected route patterns", duration: "22 min" },
  { slug: "react-fundamentals-advanced-performance-optimization", course: "react-fundamentals", category: "frontend", level: "advanced", difficulty: "advanced", order: 7, title: "Performance Optimization", description: "React.memo, lazy loading, code splitting, and profiling with DevTools", duration: "24 min" },
  { slug: "react-fundamentals-advanced-server-components", course: "react-fundamentals", category: "frontend", level: "advanced", difficulty: "advanced", order: 8, title: "Server Components", description: "React Server Components, streaming, and hybrid rendering with Next.js", duration: "26 min" },
  { slug: "react-fundamentals-advanced-testing-patterns", course: "react-fundamentals", category: "frontend", level: "advanced", difficulty: "advanced", order: 9, title: "Testing Patterns", description: "Unit and integration testing with Vitest, React Testing Library, and MSW", duration: "22 min" },

  // vue-fundamentals
  { slug: "vue-fundamentals-intermediate-composition-api", course: "vue-fundamentals", category: "frontend", level: "intermediate", difficulty: "intermediate", order: 4, title: "Composition API", description: "ref, reactive, computed, watch, and composables for reusable logic", duration: "22 min" },
  { slug: "vue-fundamentals-intermediate-pinia-state", course: "vue-fundamentals", category: "frontend", level: "intermediate", difficulty: "intermediate", order: 5, title: "Pinia State Management", description: "Stores, actions, getters, and modular state architecture with Pinia", duration: "20 min" },
  { slug: "vue-fundamentals-intermediate-vue-router", course: "vue-fundamentals", category: "frontend", level: "intermediate", difficulty: "intermediate", order: 6, title: "Vue Router", description: "Dynamic routes, navigation guards, lazy-loaded views, and route meta", duration: "18 min" },
  { slug: "vue-fundamentals-advanced-performance-optimization", course: "vue-fundamentals", category: "frontend", level: "advanced", difficulty: "advanced", order: 7, title: "Vue Performance Optimization", description: "v-memo, async components, keep-alive, and bundle size optimization", duration: "20 min" },
  { slug: "vue-fundamentals-advanced-ssr-nuxt", course: "vue-fundamentals", category: "frontend", level: "advanced", difficulty: "advanced", order: 8, title: "SSR with Nuxt", description: "Server-side rendering, hydration, data fetching, and deployment with Nuxt", duration: "28 min" },
  { slug: "vue-fundamentals-advanced-testing-vue", course: "vue-fundamentals", category: "frontend", level: "advanced", difficulty: "advanced", order: 9, title: "Testing Vue Applications", description: "Component testing with Vitest, Vue Test Utils, and E2E with Playwright", duration: "22 min" },

  // kubernetes-fundamentals
  { slug: "kubernetes-fundamentals-intermediate-pods-networking", course: "kubernetes-fundamentals", category: "devops", level: "intermediate", difficulty: "intermediate", order: 4, title: "Pods & Networking", description: "Pod lifecycle, Services, DNS, NetworkPolicies, and cluster networking basics", duration: "22 min" },
  { slug: "kubernetes-fundamentals-intermediate-helm-charts", course: "kubernetes-fundamentals", category: "devops", level: "intermediate", difficulty: "intermediate", order: 5, title: "Helm Charts", description: "Package applications with Helm, values files, and chart templating", duration: "20 min" },
  { slug: "kubernetes-fundamentals-intermediate-monitoring-logging", course: "kubernetes-fundamentals", category: "devops", level: "intermediate", difficulty: "intermediate", order: 6, title: "Monitoring & Logging", description: "Prometheus metrics, Grafana dashboards, and centralized logging with Loki", duration: "24 min" },
  { slug: "kubernetes-fundamentals-advanced-cluster-autoscaling", course: "kubernetes-fundamentals", category: "devops", level: "advanced", difficulty: "advanced", order: 7, title: "Cluster Autoscaling", description: "HPA, VPA, cluster autoscaler, and resource quota management", duration: "22 min" },
  { slug: "kubernetes-fundamentals-advanced-security-rbac", course: "kubernetes-fundamentals", category: "devops", level: "advanced", difficulty: "advanced", order: 8, title: "Security & RBAC", description: "ServiceAccounts, Roles, RoleBindings, Pod Security Standards, and secrets", duration: "26 min" },
  { slug: "kubernetes-fundamentals-advanced-gitops-cicd", course: "kubernetes-fundamentals", category: "devops", level: "advanced", difficulty: "advanced", order: 9, title: "GitOps & CI/CD", description: "ArgoCD, Flux, and automated deployment pipelines for Kubernetes", duration: "25 min" },

  // mcp-fundamentals
  { slug: "mcp-fundamentals-intermediate-protocol-deep-dive", course: "mcp-fundamentals", category: "ai-engineering", level: "intermediate", difficulty: "intermediate", order: 4, title: "MCP Protocol Deep Dive", description: "JSON-RPC message flow, capability negotiation, and transport layers", duration: "20 min" },
  { slug: "mcp-fundamentals-intermediate-resources-prompts", course: "mcp-fundamentals", category: "ai-engineering", level: "intermediate", difficulty: "intermediate", order: 5, title: "Resources & Prompts", description: "Expose data resources and reusable prompt templates through MCP servers", duration: "22 min" },
  { slug: "mcp-fundamentals-intermediate-multi-tool-orchestration", course: "mcp-fundamentals", category: "ai-engineering", level: "intermediate", difficulty: "intermediate", order: 6, title: "Multi-Tool Orchestration", description: "Chain multiple MCP tools, handle errors, and design composable tool APIs", duration: "24 min" },
  { slug: "mcp-fundamentals-advanced-production-deployment", course: "mcp-fundamentals", category: "ai-engineering", level: "advanced", difficulty: "advanced", order: 7, title: "Production Deployment", description: "Deploy MCP servers with Docker, health checks, and scaling strategies", duration: "22 min" },
  { slug: "mcp-fundamentals-advanced-security-sandboxing", course: "mcp-fundamentals", category: "ai-engineering", level: "advanced", difficulty: "advanced", order: 8, title: "Security & Sandboxing", description: "Permission scopes, input validation, and secure tool execution boundaries", duration: "20 min" },
  { slug: "mcp-fundamentals-advanced-custom-transports", course: "mcp-fundamentals", category: "ai-engineering", level: "advanced", difficulty: "advanced", order: 9, title: "Custom Transports", description: "Build stdio, SSE, and WebSocket transports for custom MCP integrations", duration: "26 min" },
]

const illustrationByCategory = {
  backend: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834&auto=format&fit=crop",
  frontend: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2940&auto=format&fit=crop",
  devops: "https://images.unsplash.com/photo-1667372393119-3d4c48d91fcb?q=80&w=2940&auto=format&fit=crop",
  "ai-engineering": "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop",
}

function buildMdx(lesson) {
  const illustration = illustrationByCategory[lesson.category] ?? illustrationByCategory.backend
  const levelLabel = lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)

  return `---
title: "${lesson.title}"
description: "${lesson.description}"
course: "${lesson.course}"
category: "${lesson.category}"
difficulty: "${lesson.difficulty}"
level: "${lesson.level}"
duration: "${lesson.duration}"
order: ${lesson.order}
illustration: "${illustration}"
---

<LearningObjectives
  objectives={["Understand core concepts of ${lesson.title}", "Apply patterns in real-world projects", "Identify best practices for ${levelLabel.toLowerCase()} developers"]}
/>

## ${lesson.title}

${lesson.description}. This module is part of the **${levelLabel}** track and builds on previous lessons in the course.

### Key Topics

- Core concepts and terminology
- Practical implementation patterns
- Common pitfalls and how to avoid them
- Real-world use cases and examples

### What You'll Build

By the end of this module, you will have hands-on experience applying **${lesson.title.toLowerCase()}** concepts in a structured, project-oriented way—similar to how Dicoding structures its learning paths from fundamentals to advanced topics.

<Tip title="Study Tip">Complete the beginner modules first if you haven't already. Each level builds on concepts from the previous section.</Tip>

### Practice Exercise

1. Review the concepts covered in this module
2. Implement a small example in your local environment
3. Mark the module as complete to track your progress toward the certificate

<Resources
  resources={[
    { title: "Official Documentation", href: "https://developer.mozilla.org" },
    { title: "Community Best Practices", href: "https://github.com" },
  ]}
/>
`
}

for (const lesson of lessons) {
  const filePath = path.join(roadmapDir, `${lesson.slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, buildMdx(lesson), "utf8")
    console.log(`Created: ${lesson.slug}.mdx`)
  } else {
    console.log(`Skipped (exists): ${lesson.slug}.mdx`)
  }
}

console.log(`Done. Total lessons in roadmap: ${fs.readdirSync(roadmapDir).filter((f) => f.endsWith(".mdx")).length}`)
