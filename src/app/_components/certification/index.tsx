import { getLinkedinCertifications } from "@/services/visitor/linkedin"
import { PageSection } from "@/components/ui/page-section"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkLink } from "@/components/ui/ink-link"
import { DEFERRED_SECTION } from "../deferred"

/** A link a reader can check, or null when only the record exists: no link or a signed `licdn.com` URL (they expire). */
export function verifyUrl(link?: string | null): string | null {
  if (!link) return null
  try {
    const url = new URL(link)
    if (!/^https?:$/.test(url.protocol) || url.hostname.endsWith("licdn.com")) return null
    return url.href
  } catch {
    return null
  }
}

export default async function CertificationSection() {
  const { data = [], total } = await getLinkedinCertifications(1, 5)
  if (data.length === 0) return null

  return (
    <PageSection id="credentials" heading={{ title: "Credentials" }} className={DEFERRED_SECTION} contentClassName="mt-6">
      <LedgerList>
        {data.map((cert) => {
          const href = verifyUrl(cert.link)
          return (
            <LedgerRow key={cert.id} title={cert.title} meta={cert.issuedDisplay}>
              <span className="flex flex-wrap items-baseline gap-x-4">
                <span>{cert.provider}</span>
                {href ? (
                  <InkLink
                    href={href}
                    external
                    event="cert-verify"
                    eventData={{ issuer: cert.provider }}
                    className="inline-flex min-h-11 items-center md:min-h-0"
                  >
                    Verify
                  </InkLink>
                ) : (
                  <span className="font-display text-caption">Record on file</span>
                )}
              </span>
            </LedgerRow>
          )
        })}
      </LedgerList>
      <p className="mt-4 text-body">
        <InkLink href="/certificates" className="inline-flex min-h-11 items-center md:min-h-0">
          All {Math.max(total || 0, data.length).toLocaleString("en")} credentials
        </InkLink>
      </p>
    </PageSection>
  )
}
