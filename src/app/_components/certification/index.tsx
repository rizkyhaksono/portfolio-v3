import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getLinkedinCertifications } from "@/services/visitor/linkedin"
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
    <section id="certifications" className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold">Latest Certifications</h2>
        <Link href="/certificates" className="inline-flex items-center gap-1 text-sm hover:underline">
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
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
