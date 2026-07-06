import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getLinkedinCertifications } from "@/services/visitor/linkedin"
import { SectionHeading } from "@/components/ui/section-heading"
import { CertificationCard } from "./certification-card"

export default async function CertificationSection() {
  let certifications: any[] = []
  try {
    const response = await getLinkedinCertifications(1, 3)
    certifications = response.data || []
  } catch (error) {
    console.error("Failed to fetch certifications:", error)
  }

  if (certifications.length === 0) {
    return null
  }

  return (
    <section id="certifications">
      <div className="mb-6 flex items-end justify-between gap-4">
        <SectionHeading eyebrow="Credentials" title="Latest" accent="certifications" />
        <Link
          href="/certificates"
          className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
        >
          <span>View all</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {certifications.map((cert) => (
          <CertificationCard key={cert.id} certification={cert} compact={true} />
        ))}
      </div>
    </section>
  )
}
