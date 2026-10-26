import Image from "next/image"
import { PageSection } from "@/components/ui/page-section"
import { PlateFigure } from "@/components/ui/plate-figure"
import { InkLink } from "@/components/ui/ink-link"
import { PORTFOLIO_PDF_GOOGLE_DRIVE_URL, RESUME_GOOGLE_DRIVE_URL } from "@/commons/constants/external-links"
import { SECTION_SPACING } from "@/lib/design-system"

const DROP_CAP =
  "first-letter:float-left first-letter:mr-2 first-letter:mt-[0.06em] first-letter:font-display first-letter:text-[4.6em] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-ink"

export default function AboutSection() {
  return (
    <PageSection
      id="about"
      className={SECTION_SPACING.section}
      heading={{ title: "About" }}
      contentClassName="mt-6 grid gap-8 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-12"
    >
      {/* From md the plate's top rule meets the first line's cap height (0.6rem below the paragraph box, measured). */}
      <PlateFigure className="w-full max-w-[20rem] md:mt-[0.6rem]">
        <Image src="/rizky.jpg" alt="Portrait of Rizky Haksono" width={1200} height={1200} sizes="(min-width: 768px) 18rem, 20rem" />
      </PlateFigure>
      <div className="prose">
        <p className={DROP_CAP}>
          My name is Muhammad Rizky Haksono, and I am a senior AI engineer at Sarana AI in Malang. I build production LLM
          systems: retrieval and embeddings, MCP integrations and cloud-native agents on AWS, with full-stack and cloud
          engineering underneath them.
        </p>
        <p>
          I ship end-to-end products with Next.js, Go and Python that cut manual work and scale real business workflows,
          with reliable CI/CD and impact I can measure. I studied informatics at Universitas Muhammadiyah Malang and
          graduated cum laude, with a GPA of 3.91 out of 4.
        </p>
        <p>
          The short version is my{" "}
          <span className="whitespace-nowrap">
            <InkLink href={RESUME_GOOGLE_DRIVE_URL} external event="resume-open" eventData={{ area: "about" }}>
              résumé
            </InkLink>
            ;
          </span>{" "}
          the long one is the{" "}
          <span className="whitespace-nowrap">
            <InkLink href={PORTFOLIO_PDF_GOOGLE_DRIVE_URL} external event="portfolio-open" eventData={{ area: "about" }}>
              portfolio (PDF)
            </InkLink>
            .
          </span>
        </p>
      </div>
    </PageSection>
  )
}
