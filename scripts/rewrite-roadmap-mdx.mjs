import fs from "fs"
import path from "path"

const dir = path.join(process.cwd(), "content", "roadmap")

const UI_IMPORTS = `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Lightbulb, Target, Shield, Code2, Layers } from "lucide-react"`

function fm(meta) {
  return `---
title: "${meta.title}"
description: "${meta.description}"
course: "${meta.course}"
category: "${meta.category}"
difficulty: "${meta.difficulty}"
level: "${meta.level}"
duration: "${meta.duration}"
order: ${meta.order}
illustration: "${meta.illustration}"
---`
}

function write(slug, meta, body, next, resources) {
  const nextBlock = next
    ? `<NextLesson title="${next.title}" description="${next.description}" href="${next.href}" />`
    : ""
  const resBlock = resources?.length
    ? `<Resources resources={${JSON.stringify(resources)}} />`
    : ""
  const content = `${fm(meta)}\n\n${UI_IMPORTS}\n${body}\n\n---\n\n## Next Steps\n\n${nextBlock}\n\n${resBlock}\n`
  fs.writeFileSync(path.join(dir, `${slug}.mdx`), content, "utf8")
  console.log("Wrote", slug)
}

// EXPRESS INTERMEDIATE
write(
  "express-fundamentals-intermediate-error-handling",
  { title: "Error Handling in Express", description: "Centralized error handling, custom error classes, and async error patterns", course: "express-fundamentals", category: "backend", difficulty: "intermediate", level: "intermediate", duration: "18 min", order: 4, illustration: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834&auto=format&fit=crop" },
  `
## Centralized Error Handling

Production APIs need predictable error responses. Express error middleware must be registered **last**.

<LearningObjectives objectives={["Create custom AppError classes with status codes", "Wrap async route handlers to catch rejected promises", "Build centralized error middleware", "Return consistent JSON error shapes"]} />

### Custom Error Classes

\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
\`\`\`

### Async Handler Wrapper

\`\`\`javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
\`\`\`

<Tabs defaultValue="err" className="my-6">
  <TabsList><TabsTrigger value="err">Error Middleware</TabsTrigger><TabsTrigger value="404">404</TabsTrigger></TabsList>
  <TabsContent value="err">
\`\`\`javascript
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: { code: err.code, message: err.message },
  })
})
\`\`\`
  </TabsContent>
  <TabsContent value="404">
\`\`\`javascript
app.use((req, res, next) => next(new AppError("Not found", 404, "NOT_FOUND")))
\`\`\`
  </TabsContent>
</Tabs>

<Tip title="Order matters">Routes → 404 handler → error handler (4-arg middleware).</Tip>
`,
  { title: "JWT Authentication", description: "Add token-based auth to your Express API.", href: "/roadmap/express-fundamentals-intermediate-jwt-auth" },
  [{ title: "Express Error Handling", href: "https://expressjs.com/en/guide/error-handling.html" }],
)

write(
  "express-fundamentals-intermediate-jwt-auth",
  { title: "JWT Authentication", description: "Implement secure authentication with JSON Web Tokens and middleware guards", course: "express-fundamentals", category: "backend", difficulty: "intermediate", level: "intermediate", duration: "22 min", order: 5, illustration: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834&auto=format&fit=crop" },
  `
## JWT Authentication in Express

JSON Web Tokens let stateless APIs authenticate users without server-side sessions.

<LearningObjectives objectives={["Sign and verify JWTs with jsonwebtoken", "Build auth middleware for protected routes", "Hash passwords with bcrypt", "Return access tokens on login"]} />

### Login & Token Generation

\`\`\`javascript
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
  res.json({ token, user: { id: user.id, email: user.email } })
})
\`\`\`

### Auth Middleware

\`\`\`javascript
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" })
  }
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}

app.get("/api/me", requireAuth, (req, res) => res.json({ user: req.user }))
\`\`\`

<Accordion type="single" collapsible className="not-prose">
  <AccordionItem value="security">
    <AccordionTrigger>Security checklist</AccordionTrigger>
    <AccordionContent>
      <ul className="list-disc pl-4 space-y-1">
        <li>Store JWT_SECRET in environment variables</li>
        <li>Use HTTPS in production</li>
        <li>Prefer short-lived access tokens + refresh tokens for sensitive apps</li>
        <li>Never store JWT in localStorage if XSS is a concern — use httpOnly cookies</li>
      </ul>
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Warning>Never commit JWT_SECRET to git. Rotate secrets if leaked.</Warning>
`,
  { title: "Database Integration", description: "Connect Express to PostgreSQL with Prisma.", href: "/roadmap/express-fundamentals-intermediate-database-integration" },
  [{ title: "jsonwebtoken", href: "https://www.npmjs.com/package/jsonwebtoken" }, { title: "OWASP JWT Cheat Sheet", href: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" }],
)

write(
  "express-fundamentals-intermediate-database-integration",
  { title: "Database Integration", description: "Connect Express to PostgreSQL with Prisma ORM and repository patterns", course: "express-fundamentals", category: "backend", difficulty: "intermediate", level: "intermediate", duration: "25 min", order: 6, illustration: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2940&auto=format&fit=crop" },
  `
## Database Integration with Prisma

Prisma provides type-safe database access and migrations for Node.js backends.

<LearningObjectives objectives={["Initialize Prisma with PostgreSQL", "Define models and run migrations", "Implement CRUD routes with Prisma Client", "Structure repositories for testability"]} />

### Schema & Client

\`\`\`prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
\`\`\`

\`\`\`javascript
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })
  res.json({ data: posts })
})
\`\`\`

<Tabs defaultValue="create" className="my-6">
  <TabsList><TabsTrigger value="create">Create</TabsTrigger><TabsTrigger value="update">Update</TabsTrigger></TabsList>
  <TabsContent value="create">
\`\`\`javascript
app.post("/api/posts", async (req, res) => {
  const post = await prisma.post.create({ data: req.body })
  res.status(201).json({ data: post })
})
\`\`\`
  </TabsContent>
  <TabsContent value="update">
\`\`\`javascript
app.patch("/api/posts/:id", async (req, res) => {
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: req.body,
  })
  res.json({ data: post })
})
\`\`\`
  </TabsContent>
</Tabs>

<Card><CardHeader><CardTitle>Repository pattern</CardTitle></CardHeader><CardContent>Extract Prisma calls into \`postRepository.js\` so routes stay thin and you can mock data in tests.</CardContent></Card>
`,
  { title: "Performance & Caching", description: "Redis caching and rate limiting.", href: "/roadmap/express-fundamentals-advanced-performance-caching" },
  [{ title: "Prisma Docs", href: "https://www.prisma.io/docs" }],
)

// EXPRESS ADVANCED
write(
  "express-fundamentals-advanced-performance-caching",
  { title: "Performance & Caching", description: "Redis caching, compression, rate limiting, and response optimization", course: "express-fundamentals", category: "backend", difficulty: "advanced", level: "advanced", duration: "20 min", order: 7, illustration: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834&auto=format&fit=crop" },
  `
## Performance & Caching

Caching reduces database load and improves response times for read-heavy endpoints.

<LearningObjectives objectives={["Set up Redis with ioredis", "Build cache-aside middleware", "Add compression and rate limiting", "Measure latency improvements"]} />

\`\`\`javascript
import Redis from "ioredis"
import compression from "compression"
import rateLimit from "express-rate-limit"

const redis = new Redis(process.env.REDIS_URL)
app.use(compression())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

async function cacheMiddleware(ttl = 60) {
  return async (req, res, next) => {
    const key = \`cache:\${req.originalUrl}\`
    const cached = await redis.get(key)
    if (cached) return res.json(JSON.parse(cached))
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      redis.setex(key, ttl, JSON.stringify(body))
      return originalJson(body)
    }
    next()
  }
}
\`\`\`

<Tip title="Cache invalidation">Invalidate keys on POST/PATCH/DELETE, or use short TTLs for eventually consistent data.</Tip>
`,
  { title: "Microservices Architecture", href: "/roadmap/express-fundamentals-advanced-microservices", description: "Split services and communicate via HTTP." },
  [{ title: "Redis", href: "https://redis.io/docs/" }],
)

write(
  "express-fundamentals-advanced-microservices",
  { title: "Microservices Architecture", description: "Split monoliths into services with API gateways and inter-service communication", course: "express-fundamentals", category: "backend", difficulty: "advanced", level: "advanced", duration: "28 min", order: 8, illustration: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2940&auto=format&fit=crop" },
  `
## Microservices with Express

Break large apps into independently deployable services with clear boundaries.

<LearningObjectives objectives={["Identify service boundaries by domain", "Call services via HTTP with timeouts", "Introduce an API gateway", "Handle partial failures gracefully"]} />

### Service Communication

\`\`\`javascript
// user-service calls order-service
const res = await fetch(\`\${ORDER_SERVICE_URL}/orders?userId=\${userId}\`, {
  signal: AbortSignal.timeout(5000),
  headers: { "x-internal-key": process.env.INTERNAL_KEY },
})
if (!res.ok) throw new Error("Order service unavailable")
const orders = await res.json()
\`\`\`

<Accordion type="multiple" className="not-prose">
  <AccordionItem value="gateway"><AccordionTrigger>API Gateway</AccordionTrigger><AccordionContent>Single entry point that routes \`/users/*\` to User Service and \`/orders/*\` to Order Service. Handles auth, rate limits, and SSL termination.</AccordionContent></AccordionItem>
  <AccordionItem value="tradeoffs"><AccordionTrigger>Trade-offs</AccordionTrigger><AccordionContent>More operational complexity (deployments, observability) vs better team autonomy and scaling per service.</AccordionContent></AccordionItem>
</Accordion>
`,
  { title: "Testing & Deployment", href: "/roadmap/express-fundamentals-advanced-testing-deployment", description: "Supertest, Docker, and CI/CD." },
  [{ title: "Microservices patterns", href: "https://microservices.io/patterns/index.html" }],
)

write(
  "express-fundamentals-advanced-testing-deployment",
  { title: "Testing & Deployment", description: "Integration tests with Supertest, CI/CD pipelines, and production deployment", course: "express-fundamentals", category: "backend", difficulty: "advanced", level: "advanced", duration: "24 min", order: 9, illustration: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834&auto=format&fit=crop" },
  `
## Testing & Deployment

Ship Express APIs with confidence using automated tests and containerized deploys.

<LearningObjectives objectives={["Write integration tests with Supertest", "Mock external dependencies", "Containerize with Docker", "Run CI pipeline on push"]} />

\`\`\`javascript
import request from "supertest"
import { app } from "../app.js"

describe("GET /api/health", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/api/health")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
  })
})
\`\`\`

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
\`\`\`

<Card><CardHeader><CardTitle>CI checklist</CardTitle></CardHeader><CardContent>Lint → test → build image → deploy. Use health checks at \`/health\` for load balancers.</CardContent></Card>
`,
  null,
  [{ title: "Supertest", href: "https://github.com/ladjs/supertest" }, { title: "Docker Node guide", href: "https://docs.docker.com/language/nodejs/" }],
)

console.log("Express done")
