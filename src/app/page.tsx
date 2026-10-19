import { Suspense } from "react"
import Image from "next/image"
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
import { InkLink } from "@/components/ui/ink-link"
import { PlateFigure } from "@/components/ui/plate-figure"
import { InkedSentence, WordScroll } from "@/components/ui/word-scroll"
import { JOB_TITLE } from "@/commons/constants/author"
import { RESUME_GOOGLE_DRIVE_URL } from "@/commons/constants/external-links"
import { SECTION_SPACING } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export const revalidate = 900

const CTA = "inline-flex min-h-11 items-center md:min-h-0"

function HeroPortrait({ className }: Readonly<{ className?: string }>) {
  return (
    <PlateFigure className={className}>
      <Image src="/rizky.jpg" alt="Rizky Haksono" width={1200} height={1200} priority fetchPriority="high" sizes="(min-width: 1024px) 26rem, 20rem" />
    </PlateFigure>
  )
}

/**
 * Masthead stage: the h1 never animates; only the sentence fills in word by word. The portrait is the LCP candidate.
 * From lg it is the right column and the two columns sit centred in the stage. Below lg it follows the lead,
 * capped in svh so the pinned stage still fits 375x667, and the sentence and links stand on the stage's foot.
 * The svh caps only bite below ~800px of height, so the stage still fits on 1280x600.
 */
function Masthead() {
  return (
    <WordScroll className={cn(SHELL_WIDTH, "flex flex-col py-10 sm:py-[min(4rem,8svh)] lg:justify-center")}>
      <div className="flex grow flex-col lg:grid lg:grow-0 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:gap-12">
        {/* From lg the name is sized to its column (cqi) so it holds one line, and its cap height meets the
            portrait's frame (-0.145em); the sentence and links then stand on the frame's foot. */}
        <div className="flex grow flex-col lg:[container-type:inline-size]">
          <h1 className="pb-0 font-display text-display text-balance text-ink [font-size:min(clamp(2.75rem,1.1961rem_+_6.6298vw,6.5rem),15svh)] lg:-mt-[0.145em] lg:[font-size:min(10.5cqi,14svh)]">
            Rizky Haksono
          </h1>
          <p className="mt-2 text-pretty font-display text-lead text-ink-soft">{JOB_TITLE} at Sarana AI, Malang, East Java.</p>
          <HeroPortrait className="mt-[min(2rem,4svh)] size-[min(24svh,20rem)] sm:size-[min(30svh,20rem)] lg:hidden" />
          <InkedSentence
            className="mt-auto max-w-[24ch] pt-[min(2rem,4svh)] text-h2 font-normal text-ink"
            text="I build production AI systems — LLMs, RAG, agents and MCP — that ship, scale and stay up."
          />
          <ul className="mt-[min(2rem,4svh)] flex flex-wrap gap-x-6 text-body">
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
        </div>
        <HeroPortrait className="hidden lg:block lg:max-w-[min(26rem,60svh)] lg:self-start lg:justify-self-end" />
      </div>
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
