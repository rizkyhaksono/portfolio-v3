import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { Onest } from "next/font/google"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { HoverTip } from "@/components/ui/hover-tip"
import { Toaster } from "@/components/layout/toaster"
import { MetadataConstants } from "@/commons/constants/metadata"
import { getMetadataBaseUrl } from "@/lib/site-url"
import { UmamiRecorder } from "@/components/layout/deferred-client-utilities"
import JsonLd from "@/components/seo/json-ld"
import { UmamiBootstrapScript } from "@/components/layout/umami-bootstrap-script"
import { THEME_HEX } from "@/lib/theme-hex"
import "./globals.css"

// Onest only (OFL): one clean sans in the spirit of Apple's SF, for the site, the admin and the cards.
const fontSans = Onest({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: true,
})

const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const umamiEnabled = process.env.NODE_ENV === "production" && !!umamiSrc && !!umamiWebsiteId

export const metadata: Metadata = {
  title: MetadataConstants.pageTitle,
  metadataBase: getMetadataBaseUrl(),
  description: MetadataConstants.description,
  keywords: MetadataConstants.keyword,
  creator: MetadataConstants.creator,
  authors: {
    name: MetadataConstants.creator,
    url: MetadataConstants.openGraph.url,
  },
  openGraph: {
    title: MetadataConstants.ogTitle,
    images: MetadataConstants.profile,
    url: MetadataConstants.openGraph.url,
    siteName: MetadataConstants.openGraph.siteName,
    locale: MetadataConstants.openGraph.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  abstract: MetadataConstants.description,
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Rizky Haksono: Writing" },
        { url: "/changelog.xml", title: "Rizky Haksono: Changelog" },
      ],
    },
  },
}

export const viewport: Viewport = {
  // dvh app shells (/chat, /ai) shrink above the Android keyboard instead of panning.
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_HEX.light.background },
    { media: "(prefers-color-scheme: dark)", color: THEME_HEX.dark.background },
  ],
}

/** App shell: fonts, theme, analytics bootstrap, and global UI primitives. */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined

  return (
    <html lang="en" data-scroll-behavior="smooth" className={fontSans.variable} suppressHydrationWarning>
      <head>
        <JsonLd nonce={nonce} />
        {umamiEnabled && (
          <>
            <UmamiBootstrapScript nonce={nonce} />
            <Script
              defer
              src={umamiSrc}
              nonce={nonce}
              data-website-id={umamiWebsiteId}
              data-domains="natee.my.id"
              data-exclude-hash="true"
              data-performance="true"
              data-before-send="umamiBeforeSend"
              strategy="afterInteractive"
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange nonce={nonce}>
          {children}
          <UmamiRecorder />
          <HoverTip />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
