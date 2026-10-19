import type { Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout"
import { MetadataConstants } from "@/commons/constants/metadata"
import { getMetadataBaseUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Tools: Pokédex, JLPT quiz, typing test and more | Rizky Haksono",
  metadataBase: getMetadataBaseUrl(),
  description: "Small free tools: a Pokédex, a Star Wars archive, a Japanese JLPT quiz, IELTS flashcards, a typing test, an anime image and quote generator, a social media downloader, Indonesian postal codes and crypto prices.",
  keywords: [
    ...MetadataConstants.keyword,
    "Japanese quiz",
    "JLPT practice",
    "IELTS flashcards",
    "video downloader",
    "tiktok downloader",
    "instagram downloader",
    "youtube downloader",
    "anime generator",
    "wpm test",
    "typing speed test",
    "postal code lookup",
    "web3 utilities",
  ],
  creator: MetadataConstants.creator,
  authors: {
    name: MetadataConstants.creator,
    url: MetadataConstants.openGraph.url,
  },
  openGraph: {
    title: "Tools: Pokédex, JLPT quiz, typing test and more",
    description: "Small tools for practising Japanese and English, testing your typing speed, downloading videos and looking things up.",
    images: MetadataConstants.profile,
    url: `${MetadataConstants.openGraph.url}/tools`,
    siteName: MetadataConstants.openGraph.siteName,
    locale: MetadataConstants.openGraph.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  )
}
