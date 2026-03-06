"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { FaGoogle, FaMicrosoft, FaStripe, FaAmazon } from "react-icons/fa"

gsap.registerPlugin(useGSAP)

export default function SignalHero() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Timeline for the entry animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Animate the background overlay (simulate sunrise/glow)
      tl.fromTo(".bg-glow", { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 2 })

      // Animate the portal appearing
      tl.fromTo(".portal-container", { y: 100, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" }, "-=1.5")

      // Animate the text staggering in
      tl.fromTo(".text-reveal", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15 }, "-=1")

      // Animate the logos fading in
      tl.fromTo(".logos-container", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.5")

      // Floating animation for the portal
      gsap.to(".portal-container", {
        y: -15,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      })
    },
    { scope: container },
  )

  return (
    <div ref={container} className="relative min-h-screen w-full bg-[#0a0510] overflow-hidden text-neutral-200">
      {/* Background with dramatic lighting */}
      <div className="absolute inset-0 z-0 bg-glow">
        <Image src="https://images.unsplash.com/photo-1542314831-c6a4d14faaf2?q=80&w=2000&auto=format&fit=crop" alt="Sunset Background" fill priority className="object-cover opacity-60" />
        {/* Gradient overlays to match the dark aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0510] via-transparent to-[#0a0510]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0510]/80 via-transparent to-transparent" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-300">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-6 bg-white rounded-sm group-hover:rotate-45 transition-transform duration-500 flex items-center justify-center">
              <div className="h-2 w-2 bg-[#0a0510] rounded-full" />
            </div>
            <span className="text-white font-bold tracking-widest uppercase">Signal</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <Link href="#" className="hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Solutions
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="#" className="hidden md:block hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="#" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all hover:scale-105">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 mt-10 md:mt-0">
        {/* The Portal Element */}
        <div className="portal-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[320px] h-[400px] md:h-[550px] z-20">
          <div className="relative w-full h-full rounded-sm overflow-hidden border border-white/20 shadow-[0_0_100px_rgba(255,100,100,0.3)]">
            <Image src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1000&auto=format&fit=crop" alt="Starry Portal" fill className="object-cover" />
            {/* Inner portal glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 via-transparent to-blue-500/20" />

            {/* Person silhouette inside portal */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end z-30">
              <div className="w-8 h-24 bg-black/80 rounded-t-[40%] blur-[1px]" />
            </div>
          </div>

          {/* Reflection on water */}
          <div className="absolute top-full left-0 w-full h-40 origin-top scale-y-[-1] opacity-30 blur-md mask-image-gradient">
            <Image src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1000&auto=format&fit=crop" alt="Starry Portal Reflection" fill className="object-cover" />
          </div>
        </div>

        {/* Hero Text Overlay */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-[20%] md:-translate-y-1/2 flex flex-col md:flex-row justify-between items-end md:items-center px-6 md:px-20 z-30 pointer-events-none">
          {/* Left Side Text */}
          <div className="max-w-xl pointer-events-auto">
            <button className="text-reveal flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-black/20 backdrop-blur-sm text-sm mb-6 hover:bg-white/10 transition-colors">
              <Play className="w-4 h-4" /> Watch Demo
            </button>
            <h1 className="text-reveal text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.1]">Your Decisions Deserve a Better Universe.</h1>
          </div>

          {/* Right Side Text */}
          <div className="text-reveal max-w-sm mt-12 md:mt-0 text-right md:text-left pointer-events-auto">
            <p className="text-neutral-300 text-lg leading-relaxed mb-8">Signal is a decision-intelligence platform that turns scattered data, uncertainty, and intuition into clear, confident actions — before opportunities disappear.</p>
            <Link href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium border border-transparent rounded-full hover:bg-neutral-200 transition-colors">
              Get Started <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Logos */}
      <footer className="logos-container relative z-30 w-full mt-auto pb-10 px-6 md:px-20 pointer-events-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-40 border-t border-white/10 pt-8 opacity-70">
          <p className="text-sm font-medium whitespace-nowrap">Used by experts at</p>
          <div className="flex items-center justify-between flex-1 gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-xl font-bold">
              <FaGoogle className="w-6 h-6" /> Google
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <FaMicrosoft className="w-6 h-6" /> Microsoft
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <FaStripe className="w-7 h-7" /> stripe
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <FaAmazon className="w-7 h-7" /> amazon
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
