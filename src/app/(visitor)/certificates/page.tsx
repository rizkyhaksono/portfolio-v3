import type { LinkedinCertification } from "@/commons/types/linkedin"
import { getLinkedinCertifications } from "@/services/visitor/linkedin"
import { CertificationRow } from "@/app/_components/certification/certification-card"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionIcon } from "@/components/layout/section-icons"

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

/** Notion's table view, grouped by year: a small group label with its count over a hairline table per year. */
export default async function CertificatesPage() {
  const certifications = await getAllCertifications()
  const years = new Map<string, LinkedinCertification[]>()
  for (const cert of certifications) years.set(yearOf(cert), [...(years.get(yearOf(cert)) ?? []), cert])

  return (
    <>
      <PageHeader
        icon={<SectionIcon href="/certificates" />}
        title="Certificates"
        description={certifications.length > 0 && `${certifications.length.toLocaleString("en")} certificates and courses on record, newest first.`}
      />

      {certifications.length === 0 ? (
        <StatusLine kind="failed">The record could not be loaded just now. Try again in a few minutes.</StatusLine>
      ) : (
        <div className="space-y-8">
          {[...years].map(([year, rows]) => (
            <section key={year} aria-labelledby={`year-${year}`}>
              <h2 id={`year-${year}`} className="mb-2 flex items-baseline gap-2 text-small font-medium text-foreground">
                {year}
                <span className="font-normal tabular-nums text-muted-foreground">
                  {rows.length}
                  <span className="sr-only"> {rows.length === 1 ? "certificate" : "certificates"}</span>
                </span>
              </h2>
              <Table className="min-w-[40rem] table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Name</TableHead>
                    <TableHead scope="col" className="w-48">Issuer</TableHead>
                    <TableHead scope="col" className="w-24">Issued</TableHead>
                    <TableHead scope="col" className="w-32">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((cert) => (
                    <CertificationRow key={cert.id} certification={cert} />
                  ))}
                </TableBody>
              </Table>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
