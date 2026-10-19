import { Suspense } from "react"
import AboutSection from "@/app/_components/about"
import SkillSection from "@/app/_components/skills"
import CareerSection from "@/app/_components/career"
import ContributionSection from "@/app/_components/contribution"
import CertificationSection from "@/app/_components/certification"
import ReadersSection from "@/app/_components/site-stats"
import RecommendationsSection from "@/app/_components/contact/linkedin-recommendations"
import ContactSection from "@/app/_components/contact"
import BaseLayout from "@/components/layout/base-layout"
import { SHELL_WIDTH } from "@/components/layout/running-head"
import { Engraving } from "@/components/ui/engraving"
import { InkLink } from "@/components/ui/ink-link"
import { InkedSentence, WordScroll } from "@/components/ui/word-scroll"
import { JOB_TITLE } from "@/commons/constants/author"
import { RESUME_GOOGLE_DRIVE_URL } from "@/commons/constants/external-links"
import { SECTION_SPACING } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export const revalidate = 900

const CTA = "inline-flex min-h-11 items-center md:min-h-0"

/**
 * Masthead stage: the h1 is the LCP element and never animates; only the sentence inks itself.
 * The svh caps only bite below ~800px of height, so h1, CTAs and plate strip still fit on 1280x600.
 */
function Masthead() {
  return (
    <WordScroll className={cn(SHELL_WIDTH, "flex flex-col pt-10 sm:pt-[min(4rem,8svh)]")}>
      {/* The bottom padding clears the italic descenders, which hang below a 0.92 line box. */}
      <h1 className="pb-[0.14em] font-display text-display text-balance text-ink [font-size:min(clamp(3.5rem,1.0138rem_+_10.6077vw,9.5rem),19svh)]">
        Rizky Haksono
      </h1>
      <p className="mt-2 font-display text-lead text-ink-soft">{JOB_TITLE} at Sarana AI, Malang, East Java.</p>
      <InkedSentence
        className="mt-[min(2rem,4svh)] max-w-[24ch] text-h2 text-ink"
        text="I build production AI systems — LLMs, RAG, agents and MCP — that ship, scale and stay up."
      />
      <ul className="mb-[min(2.5rem,5svh)] mt-[min(2rem,4svh)] flex flex-wrap gap-x-6 text-body">
        <li>
          <InkLink href="/project" event="cta-click" eventData={{ target: "projects" }} className={CTA}>
            See the projects
          </InkLink>
        </li>
        <li>
          <InkLink href="/blog" event="cta-click" eventData={{ target: "writing" }} className={CTA}>
            Read the writing
          </InkLink>
        </li>
        <li>
          <InkLink href={RESUME_GOOGLE_DRIVE_URL} external event="resume-open" eventData={{ area: "masthead" }} className={CTA}>
            Résumé (PDF)
          </InkLink>
        </li>
      </ul>
      {/* Takes what the stage has left (at least 3rem, at most min(36svh,22rem)), so it never pushes below the fold. */}
      <Engraving crop="masthead" className="mt-auto max-h-[min(36svh,22rem)] min-h-12 grow basis-12" />
    </WordScroll>
  )
}

/** Static ruled placeholder at roughly the section's final height (no pulse). */
function SectionSkeleton({ className }: Readonly<{ className: string }>) {
  return <div aria-hidden className={cn(SECTION_SPACING.section, "border-t border-ink", className)} />
}

export default function Home() {
  return (
    <BaseLayout bleed={<Masthead />}>
      <AboutSection />
      <SkillSection />
      <Suspense fallback={<SectionSkeleton className="h-[48rem]" />}>
        <CareerSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-[40rem]" />}>
        <ContributionSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-[30rem]" />}>
        <CertificationSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-[32rem]" />}>
        <ReadersSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-[40rem]" />}>
        <RecommendationsSection />
      </Suspense>
      <ContactSection />
    </BaseLayout>
  )
}
