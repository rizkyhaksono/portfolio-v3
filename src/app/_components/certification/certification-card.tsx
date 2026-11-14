import type { LinkedinCertification } from "@/commons/types/linkedin"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerRow } from "@/components/ui/ledger"

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

/** One credential as a row: the title, then issuer and date muted, with "Verify" when there is a link to check. */
export function CertificationRow({ certification }: Readonly<{ certification: LinkedinCertification }>) {
  const href = verifyUrl(certification.link)
  return (
    <LedgerRow title={certification.title}>
      <span className="flex flex-wrap items-baseline gap-x-4">
        <span>
          {certification.provider}
          {certification.issuedDisplay && `, ${certification.issuedDisplay}`}
        </span>
        {href ? (
          <InkLink
            href={href}
            external
            event="cert-verify"
            eventData={{ issuer: certification.provider }}
            className="relative after:absolute after:inset-x-0 after:-inset-y-3"
          >
            Verify
          </InkLink>
        ) : (
          <span>No public link</span>
        )}
      </span>
    </LedgerRow>
  )
}
