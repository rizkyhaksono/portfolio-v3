import type { LinkedinCertification } from "@/commons/types/linkedin"
import { getLinkedinCertifications } from "@/services/visitor/linkedin"
import { CertificationRow } from "@/app/_components/certification/certification-card"
import { LedgerList } from "@/components/ui/ledger"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"

export const revalidate = 3600

// The API caps `limit` at 50, so the whole record takes a page or two.
const PAGE_SIZE = 50
const MAX_PAGES = 10

async function getAllCertifications(): Promise<LinkedinCertification[]> {
  const first = await getLinkedinCertifications(1, PAGE_SIZE)
  const pages = Math.min(first.totalPages || 1, MAX_PAGES)
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => getLinkedinCertifications(i + 2, PAGE_SIZE)))
  return [first, ...rest].flatMap((page) => page.data ?? [])
}

const yearOf = (cert: LinkedinCertification) => /^\d{4}/.exec(cert.issued ?? "")?.[0] ?? "Undated"

export default async function CertificatesPage() {
  const certifications = await getAllCertifications()
  const years = new Map<string, LinkedinCertification[]>()
  for (const cert of certifications) years.set(yearOf(cert), [...(years.get(yearOf(cert)) ?? []), cert])

  return (
    <>
      <PageHeader
        title="Certificates"
        description={certifications.length > 0 && `${certifications.length.toLocaleString("en")} certificates and courses on record, newest first.`}
      />

      {certifications.length === 0 ? (
        <StatusLine kind="failed">The record could not be loaded just now. Try again in a few minutes.</StatusLine>
      ) : (
        <div>
          {[...years].map(([year, rows]) => (
            <LedgerList key={year} marker={<h2>{year}</h2>}>
              {rows.map((cert) => (
                <CertificationRow key={cert.id} certification={cert} />
              ))}
            </LedgerList>
          ))}
        </div>
      )}
    </>
  )
}
