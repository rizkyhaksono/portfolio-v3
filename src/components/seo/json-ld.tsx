import { MetadataConstants } from "@/commons/constants/metadata"
import { escapeJsonLd } from "@/lib/escape-json-ld"
import { getSiteUrl } from "@/lib/site-url"

interface JsonLdProps {
  nonce?: string
}

export default function JsonLd({ nonce }: Readonly<JsonLdProps>) {
  const siteUrl = getSiteUrl()

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: MetadataConstants.creator,
    url: siteUrl,
    jobTitle: MetadataConstants.jobTitle,
    sameAs: [
      "https://github.com/rizkyhaksono",
      "https://www.linkedin.com/in/rizkyhaksono",
    ],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: MetadataConstants.openGraph.siteName,
    url: siteUrl,
    description: MetadataConstants.description,
    author: { "@type": "Person", name: MetadataConstants.creator },
  }

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(person) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(website) }}
      />
    </>
  )
}
