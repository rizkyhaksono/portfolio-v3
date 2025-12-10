"use client"

import Image from "next/image"
import Link from "next/link"
import BlurFade from "@/components/magicui/blur-fade"
import { HyperText } from "@/components/magicui/hyper-text"
import { TypingAnimation } from "@/components/ui/typing-animation"
import AnimatedShinyText from "@/components/ui/animated-shiny-text"
import { cn } from "@/lib/utils"
import { media_socials } from "@/commons/constants/contact"
import { Sparkles, ArrowRight } from "lucide-react"

const roles = ["Software Engineer", "Full-Stack Developer", "Cloud Enthusiast", "DevOps Learner"]

export default function IntroSection() {
  return (
    <div className="flex flex-col-reverse gap-8">
      {/* Text Content */}
      <div className="text-left">
        {/* Status Badge */}
        <BlurFade delay={0.1} inView>
          <button
            onClick={() => {
              document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-block mb-4"
          >
            <div
              className={cn("group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800")}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center h-8 rounded-md px-3 text-xs transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <Sparkles className="mr-1.5 size-3" />
                <span>Open to Work</span>
                <ArrowRight className="ml-1.5 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </button>
        </BlurFade>

        {/* Name with HyperText */}
        <BlurFade delay={0.2} inView>
          <HyperText className="font-bold text-3xl md:text-4xl mb-2">{`Hi, I'm Muhammad Rizky Haksono`}</HyperText>
        </BlurFade>

        {/* Typing Animation for Roles */}
        <BlurFade delay={0.3} inView>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground">I&apos;m a</span>
            <TypingAnimation words={roles} className="font-semibold text-lg md:text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent" duration={80} pauseDelay={2000} loop showCursor cursorStyle="line" />
          </div>
        </BlurFade>

        {/* Bio Text */}
        <BlurFade delay={0.4} inView>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
            Passionate about <span className="font-medium text-foreground">web, mobile, cloud, and DevOps development</span>. I love creating innovative solutions using modern technologies like{" "}
            <span className="font-medium text-foreground">React, Next.js, TypeScript</span>, and more. Currently focused on building high-performance applications and learning CI/CD pipelines.
          </p>
        </BlurFade>

        {/* CTA Buttons */}
        <BlurFade delay={0.5} inView>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/project">
              <div className="h-10 rounded-lg px-4 text-sm border border-border bg-background hover:bg-accent transition-colors flex items-center gap-2">
                <span>View Projects</span>
              </div>
            </Link>
            <Link href="/changelog">
              <div className="h-10 rounded-lg px-4 text-sm border border-border bg-background hover:bg-accent transition-colors flex items-center gap-2">
                <span>View Changelog</span>
              </div>
            </Link>
          </div>
        </BlurFade>

        {/* Social Links */}
        <BlurFade delay={0.6} inView>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Find me on</span>
            <div className="flex gap-2">
              {media_socials.map((social) => (
                <Link
                  key={social.title}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-background hover:bg-accent hover:scale-105 transition-all duration-200"
                  title={social.title}
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>

      {/* Profile Image - Only visible on mobile, hidden on md and above since sidebar shows it */}
      <BlurFade delay={0.3} inView className="md:hidden">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/30 blur-2xl opacity-60 dark:opacity-40" />

          {/* Image */}
          <Image
            src="/rizky.jpg"
            alt="Muhammad Rizky Haksono"
            width={200}
            height={200}
            priority
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
