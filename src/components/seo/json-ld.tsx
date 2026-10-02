import { MetadataConstants } from "@/commons/constants/metadata"
import { getSiteUrl } from "@/lib/site-url"

export default function JsonLd() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
