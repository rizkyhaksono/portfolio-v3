import React from "react"
import SignalHero from "@/app/_components/signal-hero"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Signal Hero Design | Portfolio",
  description: "A gorgeous animated hero section inspired by Signal, built with Next.js, Tailwind, and GSAP.",
}

export default function SignalPage() {
  return (
    <main className="w-full min-h-screen bg-black">
      <SignalHero />
    </main>
  )
}
