"use client"

import Link from "next/link"
import BlurFade from "@/components/magicui/blur-fade"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { Eyebrow } from "@/components/ui/eyebrow"
import { StatStrip } from "@/components/ui/stat-strip"
import { Button } from "@/components/ui/button"
import Typography from "@/components/ui/typography"
import { media_socials } from "@/commons/constants/contact"
import { ArrowRight } from "lucide-react"
import type { OwnerProfile } from "@/services/visitor/owner-profile"

const roles = ["AI Engineer", "Cloud Enthusiast", "Full-Stack Builder"]

const HERO_STATS = [
  { label: "Focus", value: "AI Engineer" },
  { label: "Stack", value: "TS · Go" },
  { label: "Cloud", value: "AWS · Azure" },
  { label: "Based in", value: "Malang, ID" },
]

export default function IntroSection({ profile }: Readonly<{ profile?: OwnerProfile | null }>) {
  const name = profile?.name || "Muhammad Rizky Haksono"
  // Owner headshot is the bundled asset, not the OAuth/Google avatar stored on the account.
  const avatar = "/rizky.jpg"
  return (
    <div className="flex flex-col-reverse gap-8">
      {/* Text Content - Single BlurFade wrapper with CSS stagger */}
      <BlurFade delay={0.1} inView>
        <div className="text-left space-y-5">
          {/* Eyebrow */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <Eyebrow>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Open to work · AI Engineer
            </Eyebrow>
          </div>

          {/* Name — display headline with a serif-italic accent */}
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl md:text-5xl">
              Hi, I&apos;m {name}
              <Typography.Em className="text-3xl sm:text-4xl md:text-5xl">.</Typography.Em>
            </h1>
          </div>

          {/* Typing Animation for Roles */}
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">I&apos;m a</span>
              <TypingAnimation words={roles} className="font-semibold text-base md:text-lg text-primary" duration={120} pauseDelay={2500} loop showCursor cursorStyle="line" />
            </div>
          </div>

          {/* Bio Text */}
          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Building production AI systems — <span className="font-medium text-foreground">LLMs, RAG, and MCP</span> — backed by full-stack and cloud engineering. At Sarana AI I ship scalable agents and data platforms with{" "}
              <span className="font-medium text-foreground">Python, AWS, Next.js, and Go</span>, focused on reliable CI/CD and <Typography.Em>measurable</Typography.Em> impact.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/project">
                  View Projects
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/changelog">View Changelog</Link>
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center gap-3">
              <Eyebrow>Find me on</Eyebrow>
              <div className="flex flex-wrap gap-2 items-center">
                {media_socials.map((social) => (
                  <Link
                    key={social.title}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-border bg-background hover:bg-accent hover:text-primary transition-colors"
                    title={social.title}
                  >
                    <social.icon className="size-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
            <StatStrip items={HERO_STATS} className="border-x-0" />
          </div>
        </div>
      </BlurFade>

      {/* Profile Image - Only visible on mobile, hidden on md and above since sidebar shows it */}
      <BlurFade delay={0.1} inView className="md:hidden flex justify-center">
        <div className="relative w-fit">
          {/* Soft depth behind the portrait — neutral, no rainbow gradient */}
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt={name}
            width={200}
            height={200}
            className="relative rounded-full object-cover size-28 md:size-40 lg:size-48 ring-2 ring-border ring-offset-2 ring-offset-background shadow-xl"
          />

          {/* Status Dot */}
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3">
            <span className="relative flex h-3 w-3 md:h-4 md:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-green-500 ring-2 ring-background" />
            </span>
          </div>
        </div>
      </BlurFade>
    </div>
  )
}
