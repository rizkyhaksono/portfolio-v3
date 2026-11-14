import { MetadataConstants } from "@/commons/constants/metadata"
import { getSiteUrl } from "@/lib/site-url"
import { JsonLdScript } from "@/components/seo/json-ld-script"

interface JsonLdProps {
  nonce?: string
}

/** Site-wide Person and WebSite structured data for the root layout. */
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
      <JsonLdScript nonce={nonce} data={person} />
      <JsonLdScript nonce={nonce} data={website} />
    </>
  )
}