import { escapeJsonLd } from "@/lib/escape-json-ld"

interface JsonLdScriptProps {
  nonce?: string
  data: unknown
}

/** Renders escaped JSON-LD in a `application/ld+json` script (no raw HTML injection). */
export function JsonLdScript({ nonce, data }: Readonly<JsonLdScriptProps>) {
  return (
    <script type="application/ld+json" nonce={nonce}>
      {escapeJsonLd(data)}
    </script>
  )
}