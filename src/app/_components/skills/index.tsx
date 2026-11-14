import type { CSSProperties } from "react"
import { PageSection } from "@/components/ui/page-section"

const FOCUS_SKILLS = [
  {
    name: "AI systems",
    note: "Models, retrieval and the protocols that connect them.",
    skills: ["LLMs", "RAG", "MCP", "AI agents", "Embeddings", "LangChain"],
  },
  {
    name: "Application",
    note: "The languages and frameworks the products are written in.",
    skills: ["TypeScript", "Python", "Go", "Next.js", "FastAPI", "PostgreSQL"],
  },
  {
    name: "Cloud",
    note: "Where it runs, and how it gets there.",
    skills: ["AWS", "Azure", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
  },
  {
    name: "Quality",
    note: "How I know it still works.",
    skills: ["Playwright", "Jest", "OpenTelemetry", "Grafana", "Prometheus"],
  },
] as const

/**
 * Stacking deck from 768px: each plate sticks a header strip (3.25rem) lower than the last, so earlier
 * headers stay visible as the next plate slides over. Below 768px it is a plain ruled list.
 */
export default function SkillSection() {
  return (
    <PageSection id="skills" heading={{ title: "Skills" }} contentClassName="mt-6">
      <ul role="list" className="border-b border-foreground">
        {FOCUS_SKILLS.map((group, i) => (
          <li
            key={group.name}
            style={{ "--i": i } as CSSProperties}
            className="bg-paper-grain border-t border-foreground pb-8 md:sticky md:top-[calc(var(--head-h)+1rem+var(--i)*3.25rem)] md:min-h-[55svh]"
          >
            <h3 className="flex min-h-[3.25rem] items-center text-h3 text-foreground">{group.name}</h3>
            <p className="text-small text-muted-foreground">{group.note}</p>
            <ul role="list" className="mt-6 grid grid-cols-2 gap-x-6 sm:gap-x-10">
              {group.skills.map((skill) => (
                <li key={skill} className="border-t border-border py-2 text-body text-foreground">
                  {skill}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </PageSection>
  )
}
