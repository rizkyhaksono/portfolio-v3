import { MetadataConstants } from "@/commons/constants/metadata"

const siteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_SITE_URL ?? MetadataConstants.openGraph.url

export default function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: MetadataConstants.creator,
    url: siteUrl,
    jobTitle: "AI Engineer",
    sameAs: [
      MetadataConstants.openGraph.url,
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
