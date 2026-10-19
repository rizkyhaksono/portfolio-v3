import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { HoverTip } from "@/components/ui/hover-tip"
import { Toaster } from "@/components/layout/toaster"
import { MetadataConstants } from "@/commons/constants/metadata"
import { getMetadataBaseUrl } from "@/lib/site-url"
import { UmamiRecorder } from "@/components/layout/deferred-client-utilities"
import JsonLd from "@/components/seo/json-ld"
import { UMAMI_BEFORE_SEND } from "@/lib/umami-before-send"
import { PRINT_HEX } from "@/lib/print-hex"
// import { SmoothCursor } from "@/components/ui/smooth-cursor";
import "./globals.css"

// Plex Sans is variable in next/font, so it takes no weight list. Plex Mono is static and stays off the preload list.
const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: true,
})
const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
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
        { url: "/feed.xml", title: "Rizky Haksono — Blog" },
        { url: "/changelog.xml", title: "Rizky Haksono — Changelog" },
      ],
    },
  },
}

export const viewport: Viewport = {
  // dvh app shells (/chat, /ai) shrink above the Android keyboard instead of panning.
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: PRINT_HEX.paper },
    { media: "(prefers-color-scheme: dark)", color: PRINT_HEX.night },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={cn(fontSans.variable, fontMono.variable)} suppressHydrationWarning>
      <head>
        <JsonLd />
        {umamiEnabled && (
          <>
            <script dangerouslySetInnerHTML={{ __html: UMAMI_BEFORE_SEND }} />
            <Script
              defer
              src={umamiSrc}
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <UmamiRecorder />
          <HoverTip />
          <Toaster />
          {/* <div className="hidden sm:block">
            <SmoothCursor />
          </div> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
