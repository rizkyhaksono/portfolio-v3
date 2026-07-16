import BlurFade from "@/components/magicui/blur-fade"
import { ExternalLink, FileText } from "lucide-react"
import Link from "next/link"
import { SectionHeading } from "@/components/ui/section-heading"
import { Button } from "@/components/ui/button"
import {
  PORTFOLIO_PDF_GOOGLE_DRIVE_URL,
  RESUME_GOOGLE_DRIVE_URL,
} from "@/commons/constants/external-links"

export default function AboutSection() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <SectionHeading
          eyebrow="About"
          title="A little"
          accent="about me"
          description="AI Engineer at Sarana AI building production LLM systems — RAG/embeddings, MCP integrations, and cloud-native agents on AWS. I ship end-to-end products with Next.js, Go, and Python that cut manual work and scale real business workflows. Informatics graduate from Universitas Muhammadiyah Malang (Cum Laude, 3.91/4.00)."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href={RESUME_GOOGLE_DRIVE_URL} target="_blank" rel="noopener noreferrer">
              View Resume
              <ExternalLink className="size-3" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={PORTFOLIO_PDF_GOOGLE_DRIVE_URL} target="_blank" rel="noopener noreferrer">
              View Portfolio PDF
              <FileText className="size-3" />
            </Link>
          </Button>
        </div>
      </div>
    </BlurFade>
  )
}
