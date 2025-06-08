import type { Metadata } from "next";
import { Montserrat as FontSans } from "next/font/google";
import { cn } from "@/libs/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/react"
import { MetadataConstants } from "@/commons/constants/metadata";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Rizky Haksono | Software Engineer",
  metadataBase: new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.DOMAIN ?? ""
  ),
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background font-sans antialiased mx-auto ", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-right" />
          {/* <SmoothCursor /> */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html >
  );
}
