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
import { InkLink } from "@/components/ui/ink-link"
import { InkedSentence } from "@/components/ui/word-scroll"
import { JOB_TITLE } from "@/commons/constants/author"
import { RESUME_GOOGLE_DRIVE_URL } from "@/commons/constants/external-links"
import { SECTION_SPACING } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import bromoPlate from "@/assets/plates/bromo-2400.webp"

export const revalidate = 900

const CTA = "inline-flex min-h-11 items-center md:min-h-0"

/**
 * Masthead: a plate printed in Paper's ink and paper in either theme, reversed (`.print-plate`): the job line and
 * the name in cream on a dotted cobalt sky, and the Bromo plate along the bottom with its sky cut away, so the
 * peaks rise in front of the foot of the letters. The h1 is the LCP element and never animates. The name is
 * capped by width (one line from sm, two below), height (short screens) and size.
 */
function Masthead() {
  return (
    <section aria-labelledby="masthead-name" className="print-plate halftone relative isolate min-h-[max(calc(100svh-var(--head-h)),30rem)] overflow-hidden">
      <div className="absolute inset-x-0 bottom-[56%] px-[clamp(20px,4vw,48px)] text-center">
        <p className="text-pretty font-display text-lead text-ink-soft">{JOB_TITLE} at Sarana AI, Malang, East Java.</p>
        <h1
          id="masthead-name"
          className="mt-[0.15em] translate-y-[0.2em] font-display text-display text-ink [font-size:min(21vw,13svh)] sm:whitespace-nowrap sm:[font-size:min(12vw,22svh,11rem)]"
        >
          Rizky Haksono
        </h1>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 h-[56%]">
        {/* Served as is: the lossless two-ink plate (about 150 KB) beats the optimizer's lossy copies. */}
        <Image src={bromoPlate} alt="" fill priority unoptimized className="object-cover object-[45%_0%]" />
      </div>
    </section>
  )
}

/**
 * The lede on paper, just under the plate: the positioning sentence inks itself word by word as it rises
 * (its own `.ws` view timeline) and keeps a 24px floor on phones, where its ghost (3.17:1) passes as large text.
 */
function Lede() {
  return (
    <div className="ws">
      <InkedSentence
        className="max-w-[24ch] text-h1 text-ink max-sm:text-[1.5rem]"
        text="I build production AI systems — LLMs, RAG, agents and MCP — that ship, scale and stay up."
      />
      <ul className="mt-6 flex flex-wrap gap-x-6 text-body">
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
  )
}

/** Static ruled placeholder at roughly the section's final height (no pulse). */
function SectionSkeleton({ className }: Readonly<{ className: string }>) {
  return <div aria-hidden className={cn(SECTION_SPACING.section, "border-t border-ink", className)} />
}

export default function Home() {
  return (
    <BaseLayout bleed={<Masthead />}>
      <div aria-hidden data-print-hide className="reading-hairline" />
      <Lede />
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
