import BlurFade from "@/components/magicui/blur-fade"
import { SectionHeading } from "@/components/ui/section-heading"
import { Chip } from "@/components/ui/chip"

const FOCUS_SKILLS = [
  {
    name: "AI systems",
    skills: ["LLMs", "RAG", "MCP", "AI Agents", "Embeddings", "LangChain"],
  },
  {
    name: "Application",
    skills: ["TypeScript", "Python", "Go", "Next.js", "FastAPI", "PostgreSQL"],
  },
  {
    name: "Cloud",
    skills: ["AWS", "Azure", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
  },
  {
    name: "Quality",
    skills: ["Playwright", "Jest", "OpenTelemetry", "Grafana", "Prometheus"],
  },
] as const

/** Presents a concise working stack instead of an exhaustive technology inventory. */
export default function SkillSection() {
  return (
    <BlurFade>
      <section className="mt-10">
        <SectionHeading
          eyebrow="Toolkit"
          title="Skills"
          accent="& stack"
          description="A focused view of the tools I use in production."
          className="mb-5"
        />
        <div className="border-y border-border">
          {FOCUS_SKILLS.map((category) => (
            <div
              key={category.name}
              className="grid gap-3 border-b border-border py-4 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:items-start"
            >
              <h3 className="font-display text-sm font-semibold">{category.name}</h3>
              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <Chip>{skill}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </BlurFade>
  )
}
