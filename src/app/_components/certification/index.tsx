import { getLinkedinCertifications } from "@/services/visitor/linkedin"
import { PageSection } from "@/components/ui/page-section"
import { LedgerList } from "@/components/ui/ledger"
import { InkLink } from "@/components/ui/ink-link"
import { DEFERRED_SECTION } from "../deferred"
import { CertificationRow } from "./certification-card"

export { verifyUrl } from "./certification-card"

export default async function CertificationSection() {
  const { data = [], total } = await getLinkedinCertifications(1, 5)
  if (data.length === 0) return null

  return (
    <PageSection id="credentials" heading={{ title: "Certificates" }} className={DEFERRED_SECTION} contentClassName="mt-6">
      <LedgerList>
        {data.map((cert) => (
          <CertificationRow key={cert.id} certification={cert} />
        ))}
      </LedgerList>
      <p className="mt-4 text-body">
        <InkLink href="/certificates" className="inline-flex min-h-11 items-center md:min-h-0">
          All {Math.max(total || 0, data.length).toLocaleString("en")} certificates
        </InkLink>
      </p>
    </PageSection>
  )
}
