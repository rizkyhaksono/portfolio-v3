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

/** One credential in a ledger: title, issuer, "Verify" when there is a link to check, issue month on the right. */
export function CertificationRow({ certification }: Readonly<{ certification: LinkedinCertification }>) {
  const href = verifyUrl(certification.link)
  return (
    <LedgerRow title={certification.title} meta={certification.issuedDisplay && <span className="hidden sm:inline">{certification.issuedDisplay}</span>}>
      <span className="flex flex-wrap items-baseline gap-x-4">
        <span>
          {certification.provider}
          {certification.issuedDisplay && <span className="sm:hidden">, {certification.issuedDisplay}</span>}
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
          <span className="font-display text-caption">Record on file</span>
        )}
      </span>
    </LedgerRow>
  )
}
