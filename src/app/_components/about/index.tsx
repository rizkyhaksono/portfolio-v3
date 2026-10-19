import Image from "next/image"
import { PageSection } from "@/components/ui/page-section"
import { PlateFigure } from "@/components/ui/plate-figure"
import { InkLink } from "@/components/ui/ink-link"
import { PORTFOLIO_PDF_GOOGLE_DRIVE_URL, RESUME_GOOGLE_DRIVE_URL } from "@/commons/constants/external-links"

const DROP_CAP =
  "first-letter:float-left first-letter:mr-2 first-letter:mt-[0.06em] first-letter:font-display first-letter:text-[5.6em] first-letter:italic first-letter:leading-[0.74] first-letter:text-ink"

export default function AboutSection() {
  return (
    <PageSection
      id="about"
      // The masthead strip already closes the stage, so a 3rem gap (wrapper padding plus mt-4 on phones) is enough.
      className="mt-4 sm:mt-0"
      heading={{ title: "About" }}
      contentClassName="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_10rem] md:gap-12"
    >
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
          <InkLink href={RESUME_GOOGLE_DRIVE_URL} external event="resume-open" eventData={{ area: "about" }}>
            résumé
          </InkLink>
          ; the long one is the{" "}
          <InkLink href={PORTFOLIO_PDF_GOOGLE_DRIVE_URL} external event="portfolio-open" eventData={{ area: "about" }}>
            portfolio (PDF)
          </InkLink>
          .
        </p>
      </div>
      <PlateFigure className="w-40">
        <Image src="/rizky.jpg" alt="Portrait of Rizky Haksono" width={160} height={160} sizes="160px" />
      </PlateFigure>
    </PageSection>
  )
}
