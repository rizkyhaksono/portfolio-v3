import { MetadataConstants } from "@/commons/constants/metadata"
import { getSiteUrl } from "@/lib/site-url"

interface ArticleJsonLdProps {
  title: string
  description?: string
  /** Site path, for example `/blog/my-post`. */
  path: string
  image?: string | null
  published?: string | null
  modified?: string | null
}

/** BlogPosting structured data for an article page. */
export function ArticleJsonLd({ title, description, path, image, published, modified }: Readonly<ArticleJsonLdProps>) {
  const base = getSiteUrl()
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || undefined,
    url: `${base}${path}`,
    mainEntityOfPage: `${base}${path}`,
    image: image ? new URL(image, base).href : undefined,
    datePublished: published || undefined,
    dateModified: modified || published || undefined,
    author: { "@type": "Person", name: MetadataConstants.creator, url: base },
  }

  // `<` escaped so a title can never close the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }} />
}
