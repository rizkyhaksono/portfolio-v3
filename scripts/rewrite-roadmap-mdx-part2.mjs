import fs from "fs"
import path from "path"

const dir = path.join(process.cwd(), "content", "roadmap")
const UI = `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"`

function fm(m) {
  return `---
title: "${m.title}"
description: "${m.description}"
course: "${m.course}"
category: "${m.category}"
difficulty: "${m.difficulty}"
level: "${m.level}"
duration: "${m.duration}"
order: ${m.order}
illustration: "${m.illustration}"
---`
}

function write(slug, meta, body, next, resources) {
  const content = `${fm(meta)}\n\n${UI}\n${body}\n\n---\n\n## Next Steps\n\n${next ? `<NextLesson title="${next.title}" description="${next.description}" href="${next.href}" />` : ""}\n\n${resources?.length ? `<Resources resources={${JSON.stringify(resources)}} />` : ""}\n`
  fs.writeFileSync(path.join(dir, `${slug}.mdx`), content)
  console.log(slug)
}

const FE = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2940&auto=format&fit=crop"
const BE = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834&auto=format&fit=crop"
const DEVOPS = "https://images.unsplash.com/photo-1667372393119-3d4c48d91fcb?q=80&w=2940&auto=format&fit=crop"
const AI = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop"

// REACT
write("react-fundamentals-intermediate-state-management",
  { title: "State Management Patterns", description: "Context API, useReducer, and when to reach for external state libraries", course: "react-fundamentals", category: "frontend", difficulty: "intermediate", level: "intermediate", duration: "20 min", order: 4, illustration: FE },
  `## State Management in React\n\n<LearningObjectives objectives={["Use Context + useReducer for shared state", "Avoid unnecessary re-renders with split contexts", "Know when to adopt Zustand or Redux", "Lift state only as high as needed"]} />\n\n\`\`\`tsx\nconst CartContext = createContext(null)\n\nfunction cartReducer(state, action) {\n  switch (action.type) {\n    case "ADD": return { items: [...state.items, action.item] }\n    case "CLEAR": return { items: [] }\n    default: return state\n  }\n}\n\nexport function CartProvider({ children }) {\n  const [state, dispatch] = useReducer(cartReducer, { items: [] })\n  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>\n}\n\`\`\`\n\n<Tabs defaultValue="context"><TabsList><TabsTrigger value="context">Context</TabsTrigger><TabsTrigger value="when">When to escalate</TabsTrigger></TabsList><TabsContent value="context">Split **state** and **dispatch** into separate contexts so consumers that only dispatch don't re-render on state changes.</TabsContent><TabsContent value="when">Reach for Zustand/Redux when you have cross-route global state, middleware, or devtools time-travel needs.</TabsContent></Tabs>`,
  { title: "Hooks Deep Dive", description: "Master useEffect, useMemo, and custom hooks.", href: "/roadmap/react-fundamentals-intermediate-hooks-deep-dive" },
  [{ title: "React useReducer", href: "https://react.dev/reference/react/useReducer" }])

write("react-fundamentals-intermediate-hooks-deep-dive",
  { title: "Hooks Deep Dive", description: "Custom hooks, useEffect cleanup, useMemo, useCallback, and performance hooks", course: "react-fundamentals", category: "frontend", difficulty: "intermediate", level: "intermediate", duration: "25 min", order: 5, illustration: FE },
  `## Advanced Hooks\n\n<LearningObjectives objectives={["Write cleanup functions in useEffect", "Memoize expensive computations with useMemo", "Stabilize callbacks with useCallback", "Extract reusable logic into custom hooks"]} />\n\n\`\`\`tsx\nfunction useDebounce(value, delay = 300) {\n  const [debounced, setDebounced] = useState(value)\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay)\n    return () => clearTimeout(id)\n  }, [value, delay])\n  return debounced\n}\n\`\`\`\n\n<Tip title="Dependency array">Include every value from component scope that changes between renders and is used inside the effect.</Tip>\n\n\`\`\`tsx\nconst sorted = useMemo(() => heavySort(items), [items])\nconst onSave = useCallback(() => save(form), [form])\n\`\`\``,
  { title: "React Router", href: "/roadmap/react-fundamentals-intermediate-react-router", description: "Client-side routing and protected routes." },
  [{ title: "Rules of Hooks", href: "https://react.dev/reference/rules/rules-of-hooks" }])

write("react-fundamentals-intermediate-react-router",
  { title: "React Router", description: "Client-side routing, nested routes, loaders, and protected route patterns", course: "react-fundamentals", category: "frontend", difficulty: "intermediate", level: "intermediate", duration: "22 min", order: 6, illustration: FE },
  `## React Router v6+\n\n<LearningObjectives objectives={["Define routes with createBrowserRouter", "Use nested layouts and Outlet", "Load data with loaders", "Protect routes with auth checks"]} />\n\n\`\`\`tsx\nconst router = createBrowserRouter([\n  {\n    path: "/",\n    element: <RootLayout />,\n    children: [\n      { index: true, element: <Home /> },\n      { path: "dashboard", element: <Protected><Dashboard /></Protected>, loader: dashboardLoader },\n    ],\n  },\n])\n\`\`\`\n\n<Accordion type="single" collapsible className="not-prose"><AccordionItem value="guard"><AccordionTrigger>Protected route</AccordionTrigger><AccordionContent>\`\`\`tsx\nfunction Protected({ children }) {\n  const { user } = useAuth()\n  if (!user) return <Navigate to="/login" replace />\n  return children\n}\n\`\`\`</AccordionContent></AccordionItem></Accordion>`,
  { title: "Performance Optimization", href: "/roadmap/react-fundamentals-advanced-performance-optimization", description: "Memoization and code splitting." },
  [{ title: "React Router", href: "https://reactrouter.com/" }])

write("react-fundamentals-advanced-performance-optimization",
  { title: "Performance Optimization", description: "React.memo, lazy loading, code splitting, and profiling with DevTools", course: "react-fundamentals", category: "frontend", difficulty: "advanced", level: "advanced", duration: "24 min", order: 7, illustration: FE },
  `## React Performance\n\n<LearningObjectives objectives={["Profile with React DevTools Profiler", "Split bundles with React.lazy and Suspense", "Prevent wasted renders with memo", "Virtualize long lists"]} />\n\n\`\`\`tsx\nconst HeavyChart = lazy(() => import("./HeavyChart"))\n\nfunction Page() {\n  return (\n    <Suspense fallback={<Skeleton />}>\n      <HeavyChart data={data} />\n    </Suspense>\n  )\n}\n\`\`\`\n\n<Warning>Don't memo everything — measure first. Premature memoization adds complexity.</Warning>`,
  { title: "Server Components", href: "/roadmap/react-fundamentals-advanced-server-components", description: "RSC and streaming." },
  [{ title: "React Performance", href: "https://react.dev/learn/render-and-commit" }])

write("react-fundamentals-advanced-server-components",
  { title: "Server Components", description: "React Server Components, streaming, and hybrid rendering with Next.js", course: "react-fundamentals", category: "frontend", difficulty: "advanced", level: "advanced", duration: "26 min", order: 8, illustration: FE },
  `## React Server Components\n\n<LearningObjectives objectives={["Distinguish Server vs Client Components", "Fetch data on the server without useEffect", "Stream UI with Suspense boundaries", "Choose 'use client' only when needed"]} />\n\n\`\`\`tsx\n// app/posts/page.tsx — Server Component (default in App Router)\nexport default async function PostsPage() {\n  const posts = await db.post.findMany()\n  return <PostList posts={posts} />\n}\n\`\`\`\n\n<Card><CardHeader><CardTitle>When to use 'use client'</CardTitle></CardHeader><CardContent>Event handlers, hooks, browser APIs, and local state require Client Components.</CardContent></Card>`,
  { title: "Testing Patterns", href: "/roadmap/react-fundamentals-advanced-testing-patterns", description: "Vitest and Testing Library." },
  [{ title: "Server Components", href: "https://react.dev/reference/rsc/server-components" }])

write("react-fundamentals-advanced-testing-patterns",
  { title: "Testing Patterns", description: "Unit and integration testing with Vitest, React Testing Library, and MSW", course: "react-fundamentals", category: "frontend", difficulty: "advanced", level: "advanced", duration: "22 min", order: 9, illustration: FE },
  `## Testing React Apps\n\n<LearningObjectives objectives={["Query by role with Testing Library", "Mock API calls with MSW", "Test user flows not implementation details", "Run tests in CI with Vitest"]} />\n\n\`\`\`tsx\nimport { render, screen } from "@testing-library/react"\nimport userEvent from "@testing-library/user-event"\n\ntest("submits form", async () => {\n  render(<LoginForm />)\n  await userEvent.type(screen.getByLabelText(/email/i), "a@b.com")\n  await userEvent.click(screen.getByRole("button", { name: /sign in/i }))\n  expect(await screen.findByText(/welcome/i)).toBeInTheDocument()\n})\n\`\`\``,
  null,
  [{ title: "Testing Library", href: "https://testing-library.com/docs/react-testing-library/intro/" }, { title: "MSW", href: "https://mswjs.io/" }])

// VUE
write("vue-fundamentals-intermediate-composition-api",
  { title: "Composition API", description: "ref, reactive, computed, watch, and composables for reusable logic", course: "vue-fundamentals", category: "frontend", difficulty: "intermediate", level: "intermediate", duration: "22 min", order: 4, illustration: FE },
  `## Vue Composition API\n\n<LearningObjectives objectives={["Use ref and reactive correctly", "Derive state with computed", "React to changes with watch/watchEffect", "Extract composables for reuse"]} />\n\n\`\`\`vue\n<script setup>\nimport { ref, computed, watch } from 'vue'\n\nconst count = ref(0)\nconst doubled = computed(() => count.value * 2)\n\nwatch(count, (n) => console.log('count:', n))\n\nfunction increment() { count.value++ }\n</script>\n\`\`\`\n\n\`\`\`js\n// composables/useFetch.js\nexport function useFetch(url) {\n  const data = ref(null)\n  const error = ref(null)\n  watchEffect(async () => {\n    try { data.value = await (await fetch(url)).json() }\n    catch (e) { error.value = e }\n  })\n  return { data, error }\n}\n\`\`\``,
  { title: "Pinia State Management", href: "/roadmap/vue-fundamentals-intermediate-pinia-state", description: "Global stores with Pinia." },
  [{ title: "Composition API", href: "https://vuejs.org/guide/extras/composition-api-faq.html" }])

write("vue-fundamentals-intermediate-pinia-state",
  { title: "Pinia State Management", description: "Stores, actions, getters, and modular state architecture with Pinia", course: "vue-fundamentals", category: "frontend", difficulty: "intermediate", level: "intermediate", duration: "20 min", order: 5, illustration: FE },
  `## Pinia Stores\n\n<LearningObjectives objectives={["Create stores with defineStore", "Define actions for async logic", "Use getters for derived state", "Split stores by domain"]} />\n\n\`\`\`js\nexport const useUserStore = defineStore('user', {\n  state: () => ({ user: null, token: null }),\n  getters: {\n    isLoggedIn: (s) => !!s.token,\n  },\n  actions: {\n    async login(email, password) {\n      const res = await api.post('/auth/login', { email, password })\n      this.user = res.user\n      this.token = res.token\n    },\n  },\n})\n\`\`\``,
  { title: "Vue Router", href: "/roadmap/vue-fundamentals-intermediate-vue-router", description: "Routing and guards." },
  [{ title: "Pinia", href: "https://pinia.vuejs.org/" }])

write("vue-fundamentals-intermediate-vue-router",
  { title: "Vue Router", description: "Dynamic routes, navigation guards, lazy-loaded views, and route meta", course: "vue-fundamentals", category: "frontend", difficulty: "intermediate", level: "intermediate", duration: "18 min", order: 6, illustration: FE },
  `## Vue Router\n\n<LearningObjectives objectives={["Configure dynamic routes", "Add navigation guards", "Lazy-load route components", "Use route meta for permissions"]} />\n\n\`\`\`js\nconst routes = [\n  { path: '/users/:id', component: () => import('./UserView.vue'), meta: { requiresAuth: true } },\n]\n\nrouter.beforeEach((to) => {\n  if (to.meta.requiresAuth && !useUserStore().isLoggedIn) return '/login'\n})\n\`\`\``,
  { title: "Vue Performance Optimization", href: "/roadmap/vue-fundamentals-advanced-performance-optimization", description: "Optimize renders." },
  [{ title: "Vue Router", href: "https://router.vuejs.org/" }])

write("vue-fundamentals-advanced-performance-optimization",
  { title: "Vue Performance Optimization", description: "v-memo, async components, keep-alive, and bundle size optimization", course: "vue-fundamentals", category: "frontend", difficulty: "advanced", level: "advanced", duration: "20 min", order: 7, illustration: FE },
  `## Vue Performance\n\n<LearningObjectives objectives={["Use v-memo for expensive lists", "Lazy-load heavy components", "Cache views with keep-alive", "Analyze bundle with rollup-plugin-visualizer"]} />\n\n\`\`\`vue\n<template>\n  <KeepAlive>\n    <component :is="activeTab" />\n  </KeepAlive>\n</template>\n\`\`\`\n\n<Tip>Use \`defineAsyncComponent\` for code-splitting route-level chunks.</Tip>`,
  { title: "SSR with Nuxt", href: "/roadmap/vue-fundamentals-advanced-ssr-nuxt", description: "Nuxt 3 rendering." },
  [{ title: "Vue Performance", href: "https://vuejs.org/guide/best-practices/performance.html" }])

write("vue-fundamentals-advanced-ssr-nuxt",
  { title: "SSR with Nuxt", description: "Server-side rendering, hydration, data fetching, and deployment with Nuxt", course: "vue-fundamentals", category: "frontend", difficulty: "advanced", level: "advanced", duration: "28 min", order: 8, illustration: FE },
  `## Nuxt 3 SSR\n\n<LearningObjectives objectives={["Fetch data with useFetch/useAsyncData", "Understand SSR vs CSR trade-offs", "Deploy to Vercel or Node server", "Use server routes for secrets"]} />\n\n\`\`\`vue\n<script setup>\nconst { data: posts } = await useFetch('/api/posts')\n</script>\n\`\`\`\n\n<Card><CardHeader><CardTitle>Server routes</CardTitle></CardHeader><CardContent>Place API keys in \`server/api/\` — never expose them to the client bundle.</CardContent></Card>`,
  { title: "Testing Vue Applications", href: "/roadmap/vue-fundamentals-advanced-testing-vue", description: "Vitest + Vue Test Utils." },
  [{ title: "Nuxt", href: "https://nuxt.com/docs" }])

write("vue-fundamentals-advanced-testing-vue",
  { title: "Testing Vue Applications", description: "Component testing with Vitest, Vue Test Utils, and E2E with Playwright", course: "vue-fundamentals", category: "frontend", difficulty: "advanced", level: "advanced", duration: "22 min", order: 9, illustration: FE },
  `## Testing Vue\n\n<LearningObjectives objectives={["Mount components with Vue Test Utils", "Test emitted events and slots", "Mock Pinia stores", "Write E2E flows with Playwright"]} />\n\n\`\`\`js\nimport { mount } from '@vue/test-utils'\nimport Counter from './Counter.vue'\n\ntest('increments', async () => {\n  const wrapper = mount(Counter)\n  await wrapper.find('button').trigger('click')\n  expect(wrapper.text()).toContain('1')\n})\n\`\`\``,
  null,
  [{ title: "Vue Test Utils", href: "https://test-utils.vuejs.org/" }])

// KUBERNETES
write("kubernetes-fundamentals-intermediate-pods-networking",
  { title: "Pods & Networking", description: "Pod lifecycle, Services, DNS, NetworkPolicies, and cluster networking basics", course: "kubernetes-fundamentals", category: "devops", difficulty: "intermediate", level: "intermediate", duration: "22 min", order: 4, illustration: DEVOPS },
  `## Pods & Networking\n\n<LearningObjectives objectives={["Write Pod and Deployment manifests", "Expose apps with ClusterIP and LoadBalancer Services", "Understand cluster DNS", "Restrict traffic with NetworkPolicy"]} />\n\n\`\`\`yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  selector:\n    app: api\n  ports:\n    - port: 80\n      targetPort: 3000\n  type: ClusterIP\n\`\`\`\n\n<Tabs defaultValue="dns"><TabsList><TabsTrigger value="dns">DNS</TabsTrigger><TabsTrigger value="policy">NetworkPolicy</TabsTrigger></TabsList><TabsContent value="dns">Pods reach services at \`http://api-service.default.svc.cluster.local\`.</TabsContent><TabsContent value="policy">NetworkPolicy uses label selectors to allow/deny ingress and egress.</TabsContent></Tabs>`,
  { title: "Helm Charts", href: "/roadmap/kubernetes-fundamentals-intermediate-helm-charts", description: "Package apps with Helm." },
  [{ title: "Kubernetes Services", href: "https://kubernetes.io/docs/concepts/services-networking/service/" }])

write("kubernetes-fundamentals-intermediate-helm-charts",
  { title: "Helm Charts", description: "Package applications with Helm, values files, and chart templating", course: "kubernetes-fundamentals", category: "devops", difficulty: "intermediate", level: "intermediate", duration: "20 min", order: 5, illustration: DEVOPS },
  `## Helm Charts\n\n<LearningObjectives objectives={["Understand chart directory structure", "Parameterize with values.yaml", "Template manifests with Go templates", "Install and upgrade releases"]} />\n\n\`\`\`yaml\n# values.yaml\nreplicaCount: 2\nimage:\n  repository: myapp\n  tag: "1.0.0"\n\`\`\`\n\n\`\`\`yaml\n# templates/deployment.yaml\nreplicas: {{ .Values.replicaCount }}\nimage: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n\`\`\`\n\n\`\`\`bash\nhelm install myapp ./chart -f values.prod.yaml\nhelm upgrade myapp ./chart --set replicaCount=3\n\`\`\``,
  { title: "Monitoring & Logging", href: "/roadmap/kubernetes-fundamentals-intermediate-monitoring-logging", description: "Prometheus and Grafana." },
  [{ title: "Helm", href: "https://helm.sh/docs/" }])

write("kubernetes-fundamentals-intermediate-monitoring-logging",
  { title: "Monitoring & Logging", description: "Prometheus metrics, Grafana dashboards, and centralized logging with Loki", course: "kubernetes-fundamentals", category: "devops", difficulty: "intermediate", level: "intermediate", duration: "24 min", order: 6, illustration: DEVOPS },
  `## Observability Stack\n\n<LearningObjectives objectives={["Scrape metrics with Prometheus", "Create Grafana dashboards", "Ship logs to Loki", "Define alerts for SLOs"]} />\n\n\`\`\`yaml\napiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  name: api-metrics\nspec:\n  selector:\n    matchLabels:\n      app: api\n  endpoints:\n    - port: metrics\n      interval: 30s\n\`\`\`\n\n<Card><CardHeader><CardTitle>Golden signals</CardTitle></CardHeader><CardContent>Latency, traffic, errors, saturation — monitor these per service.</CardContent></Card>`,
  { title: "Cluster Autoscaling", href: "/roadmap/kubernetes-fundamentals-advanced-cluster-autoscaling", description: "HPA and VPA." },
  [{ title: "Prometheus", href: "https://prometheus.io/docs/" }])

write("kubernetes-fundamentals-advanced-cluster-autoscaling",
  { title: "Cluster Autoscaling", description: "HPA, VPA, cluster autoscaler, and resource quota management", course: "kubernetes-fundamentals", category: "devops", difficulty: "advanced", level: "advanced", duration: "22 min", order: 7, illustration: DEVOPS },
  `## Autoscaling\n\n<LearningObjectives objectives={["Configure HorizontalPodAutoscaler", "Set CPU/memory requests and limits", "Use VPA for right-sizing", "Scale nodes with cluster autoscaler"]} />\n\n\`\`\`yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: api-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70\n\`\`\``,
  { title: "Security & RBAC", href: "/roadmap/kubernetes-fundamentals-advanced-security-rbac", description: "Roles and Pod Security." },
  [{ title: "HPA", href: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" }])

write("kubernetes-fundamentals-advanced-security-rbac",
  { title: "Security & RBAC", description: "ServiceAccounts, Roles, RoleBindings, Pod Security Standards, and secrets", course: "kubernetes-fundamentals", category: "devops", difficulty: "advanced", level: "advanced", duration: "26 min", order: 8, illustration: DEVOPS },
  `## Kubernetes Security\n\n<LearningObjectives objectives={["Apply least-privilege RBAC", "Mount secrets safely", "Enforce Pod Security Standards", "Rotate credentials regularly"]} />\n\n\`\`\`yaml\nkind: Role\nmetadata:\n  name: pod-reader\nrules:\n  - apiGroups: [""]\n    resources: ["pods"]\n    verbs: ["get", "list"]\n---\nkind: RoleBinding\nmetadata:\n  name: read-pods\nsubjects:\n  - kind: ServiceAccount\n    name: app-sa\nroleRef:\n  kind: Role\n  name: pod-reader\n  apiGroup: rbac.authorization.k8s.io\n\`\`\`\n\n<Warning>Never commit plain-text secrets to git — use Sealed Secrets or external secret operators.</Warning>`,
  { title: "GitOps & CI/CD", href: "/roadmap/kubernetes-fundamentals-advanced-gitops-cicd", description: "ArgoCD deployments." },
  [{ title: "RBAC", href: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" }])

write("kubernetes-fundamentals-advanced-gitops-cicd",
  { title: "GitOps & CI/CD", description: "ArgoCD, Flux, and automated deployment pipelines for Kubernetes", course: "kubernetes-fundamentals", category: "devops", difficulty: "advanced", level: "advanced", duration: "25 min", order: 9, illustration: DEVOPS },
  `## GitOps with ArgoCD\n\n<LearningObjectives objectives={["Define ArgoCD Application manifests", "Sync cluster state from Git", "Promote across environments", "Rollback with Git revert"]} />\n\n\`\`\`yaml\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: myapp\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/org/k8s-manifests\n    path: apps/myapp\n    targetRevision: main\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n\`\`\``,
  null,
  [{ title: "ArgoCD", href: "https://argo-cd.readthedocs.io/" }])

// MCP
write("mcp-fundamentals-intermediate-protocol-deep-dive",
  { title: "MCP Protocol Deep Dive", description: "JSON-RPC message flow, capability negotiation, and transport layers", course: "mcp-fundamentals", category: "ai-engineering", difficulty: "intermediate", level: "intermediate", duration: "20 min", order: 4, illustration: AI },
  `## MCP Protocol\n\n<LearningObjectives objectives={["Understand JSON-RPC request/response flow", "Negotiate server capabilities at init", "Handle notifications vs requests", "Debug with structured logging"]} />\n\n\`\`\`json\n{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "method": "tools/list",\n  "params": {}\n}\n\`\`\`\n\n<Accordion type="single" collapsible className="not-prose"><AccordionItem value="init"><AccordionTrigger>Initialize handshake</AccordionTrigger><AccordionContent>Client sends \`initialize\` with protocol version; server responds with capabilities (tools, resources, prompts).</AccordionContent></AccordionItem></Accordion>`,
  { title: "Resources & Prompts", href: "/roadmap/mcp-fundamentals-intermediate-resources-prompts", description: "Expose data and templates." },
  [{ title: "MCP Specification", href: "https://modelcontextprotocol.io/" }])

write("mcp-fundamentals-intermediate-resources-prompts",
  { title: "Resources & Prompts", description: "Expose data resources and reusable prompt templates through MCP servers", course: "mcp-fundamentals", category: "ai-engineering", difficulty: "intermediate", level: "intermediate", duration: "22 min", order: 5, illustration: AI },
  `## Resources and Prompts\n\n<LearningObjectives objectives={["Register static and dynamic resources", "Define prompt templates with arguments", "Return structured content to clients", "Version resource URIs"]} />\n\n\`\`\`typescript\nserver.setRequestHandler(ListResourcesRequestSchema, async () => ({\n  resources: [{ uri: "file:///docs/api.md", name: "API Docs", mimeType: "text/markdown" }],\n}))\n\nserver.setRequestHandler(GetPromptRequestSchema, async (req) => ({\n  messages: [{ role: "user", content: { type: "text", text: \`Review: \${req.params.arguments?.code}\` } }],\n}))\n\`\`\``,
  { title: "Multi-Tool Orchestration", href: "/roadmap/mcp-fundamentals-intermediate-multi-tool-orchestration", description: "Chain tools safely." },
  [{ title: "MCP Resources", href: "https://modelcontextprotocol.io/docs/concepts/resources" }])

write("mcp-fundamentals-intermediate-multi-tool-orchestration",
  { title: "Multi-Tool Orchestration", description: "Chain multiple MCP tools, handle errors, and design composable tool APIs", course: "mcp-fundamentals", category: "ai-engineering", difficulty: "intermediate", level: "intermediate", duration: "24 min", order: 6, illustration: AI },
  `## Tool Orchestration\n\n<LearningObjectives objectives={["Design single-purpose tools", "Compose workflows across tools", "Propagate errors with context", "Validate tool inputs with Zod"]} />\n\n\`\`\`typescript\nserver.tool("search_repo", { query: z.string() }, async ({ query }) => {\n  const files = await search(query)\n  return { content: [{ type: "text", text: JSON.stringify(files) }] }\n})\n\`\`\`\n\n<Tip>Keep tools idempotent where possible so retries are safe.</Tip>`,
  { title: "Production Deployment", href: "/roadmap/mcp-fundamentals-advanced-production-deployment", description: "Docker and health checks." },
  [{ title: "MCP Tools", href: "https://modelcontextprotocol.io/docs/concepts/tools" }])

write("mcp-fundamentals-advanced-production-deployment",
  { title: "Production Deployment", description: "Deploy MCP servers with Docker, health checks, and scaling strategies", course: "mcp-fundamentals", category: "ai-engineering", difficulty: "advanced", level: "advanced", duration: "22 min", order: 7, illustration: AI },
  `## Production MCP Servers\n\n<LearningObjectives objectives={["Containerize stdio/SSE servers", "Add health and readiness endpoints", "Configure env-based secrets", "Run behind reverse proxy for SSE"]} />\n\n\`\`\`dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY dist ./dist\nCMD ["node", "dist/index.js"]\n\`\`\`\n\n<Card><CardHeader><CardTitle>SSE transport</CardTitle></CardHeader><CardContent>Expose HTTP endpoint with TLS; stdio remains best for local IDE integrations.</CardContent></Card>`,
  { title: "Security & Sandboxing", href: "/roadmap/mcp-fundamentals-advanced-security-sandboxing", description: "Scopes and validation." },
  [{ title: "MCP SDK", href: "https://github.com/modelcontextprotocol/typescript-sdk" }])

write("mcp-fundamentals-advanced-security-sandboxing",
  { title: "Security & Sandboxing", description: "Permission scopes, input validation, and secure tool execution boundaries", course: "mcp-fundamentals", category: "ai-engineering", difficulty: "advanced", level: "advanced", duration: "20 min", order: 8, illustration: AI },
  `## MCP Security\n\n<LearningObjectives objectives={["Validate all tool inputs", "Limit filesystem and network access", "Audit tool invocations", "Run servers with minimal OS permissions"]} />\n\n\`\`\`typescript\nconst schema = z.object({ path: z.string().max(256).regex(/^[a-zA-Z0-9_/.-]+$/) })\n\nserver.tool("read_file", schema, async ({ path }) => {\n  if (!path.startsWith(ALLOWED_ROOT)) throw new Error("Path not allowed")\n  return { content: [{ type: "text", text: await fs.readFile(path, "utf8") }] }\n})\n\`\`\`\n\n<Warning>Never execute arbitrary shell commands from LLM-provided strings without strict allowlists.</Warning>`,
  { title: "Custom Transports", href: "/roadmap/mcp-fundamentals-advanced-custom-transports", description: "stdio, SSE, WebSocket." },
  [{ title: "MCP Security", href: "https://modelcontextprotocol.io/" }])

write("mcp-fundamentals-advanced-custom-transports",
  { title: "Custom Transports", description: "Build stdio, SSE, and WebSocket transports for custom MCP integrations", course: "mcp-fundamentals", category: "ai-engineering", difficulty: "advanced", level: "advanced", duration: "26 min", order: 9, illustration: AI },
  `## Custom Transports\n\n<LearningObjectives objectives={["Implement stdio transport for CLI tools", "Build SSE server for remote clients", "Compare WebSocket vs SSE trade-offs", "Handle reconnection and heartbeats"]} />\n\n<Tabs defaultValue="stdio" className="my-6"><TabsList><TabsTrigger value="stdio">stdio</TabsTrigger><TabsTrigger value="sse">SSE</TabsTrigger></TabsList><TabsContent value="stdio">Best for Cursor/Claude Desktop — process spawned with stdin/stdout JSON-RPC lines.</TabsContent><TabsContent value="sse">HTTP long-lived stream for browser or remote agents; requires auth at edge.</TabsContent></Tabs>\n\n\`\`\`typescript\nimport { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"\nconst transport = new StdioServerTransport()\nawait server.connect(transport)\n\`\`\``,
  null,
  [{ title: "MCP Transports", href: "https://modelcontextprotocol.io/docs/concepts/transports" }])

console.log("Part 2 complete")
