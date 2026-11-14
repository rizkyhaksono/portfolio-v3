import type { LinkedinCertification } from "@/commons/types/linkedin"
import { InkLink } from "@/components/ui/ink-link"
import { TableCell, TableRow } from "@/components/ui/table"

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

/** One credential as a Notion table row: name, issuer, date, and "Verify" when there is a link to check. */
export function CertificationRow({ certification }: Readonly<{ certification: LinkedinCertification }>) {
  const href = verifyUrl(certification.link)
  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{certification.title}</TableCell>
      <TableCell className="text-foreground">{certification.provider}</TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">{certification.issuedDisplay || "Undated"}</TableCell>
      <TableCell className="whitespace-nowrap">
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
          <span className="text-muted-foreground">No public link</span>
        )}
      </TableCell>
    </TableRow>
  )
}
