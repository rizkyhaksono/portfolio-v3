import type { Metadata } from "next"
import Script from "next/script"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "sonner"
import { MetadataConstants } from "@/commons/constants/metadata"
import ScrollToTop from "@/components/ui/scroll-to-top"
import { CommandPalette } from "@/components/ui/command-palette"
import TerminalOverlay from "@/components/ui/terminal-overlay"
import FeedbackWidget from "@/components/ui/feedback-widget"
import JsonLd from "@/components/seo/json-ld"
// import { SmoothCursor } from "@/components/ui/smooth-cursor";
import "./globals.css"

// Type system, SELF-HOSTED (next/font/local) so the build never hits the network:
// Inter (body), Bricolage Grotesque (display headings), Instrument Serif (italic
// accent words), JetBrains Mono (uppercase labels/chips). Files in ./fonts.
const fontSans = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
})
const fontDisplay = localFont({
  src: "./fonts/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 800",
})
const fontSerif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
})
const fontMono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "100 800",
})

const fontVariables = cn(fontSans.variable, fontDisplay.variable, fontSerif.variable, fontMono.variable)

export const metadata: Metadata = {
  title: "Rizky Haksono | Software Engineer",
  metadataBase: new URL(process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.DOMAIN ?? ""),
  description: MetadataConstants.description,
  keywords: MetadataConstants.keyword,
  creator: MetadataConstants.creator,
  authors: {
    name: MetadataConstants.creator,
    url: MetadataConstants.openGraph.url,
  },
  openGraph: {
    title: "Muhammad Rizky Haksono | Software Engineer",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
        <Script
          defer
          src={process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js"}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "3344dd5c-2e88-4ae5-95f7-e142cdbff614"}
          strategy="afterInteractive"
        />
      </head>
      <body className={cn("bg-background font-sans antialiased mx-auto", fontVariables)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <CommandPalette />
          <TerminalOverlay />
          <FeedbackWidget />
          <ScrollToTop />
          <Toaster position="top-right" />
          {/* <div className="hidden sm:block">
            <SmoothCursor />
          </div> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
