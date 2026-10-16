import { PageSection } from "@/components/ui/page-section"
import { getLinkedinRecommendations } from "@/services/visitor/linkedin"
import { DEFERRED_SECTION } from "../deferred"

/** Three recommendations from LinkedIn as italic pull quotes. Static markup. */
export default async function RecommendationsSection() {
  const { data } = await getLinkedinRecommendations()
  const quotes = (data ?? []).filter((rec) => rec.message?.trim()).slice(0, 3)
  if (quotes.length === 0) return null

  return (
    <PageSection id="recommendations" heading={{ title: "Recommendations" }} className={DEFERRED_SECTION} contentClassName="mt-6 space-y-10">
      {quotes.map((rec) => (
        <figure key={rec.id} className="max-w-[62ch] border-l border-ink pl-5">
          <blockquote className="font-display text-prose text-ink">{rec.message.trim()}</blockquote>
          <figcaption className="mt-3 text-small text-ink-soft">{rec.name}, on LinkedIn</figcaption>
        </figure>
      ))}
    </PageSection>
  )
}
