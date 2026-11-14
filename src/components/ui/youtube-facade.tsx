"use client"

import { useState } from "react"
import { Play } from "lucide-react"

import { cn } from "@/lib/utils"

interface YouTubeFacadeProps {
  /** The 11-character video id. */
  id: string
  title: string
  /** Lesson slug, sent as the `video-play` event's `lesson`. */
  lesson?: string
  className?: string
}

/** Click-to-load YouTube: the poster on a rounded tile until asked, then the privacy-enhanced player. Nothing autoplays on load. */
export function YouTubeFacade({ id, title, lesson, className }: Readonly<YouTubeFacadeProps>) {
  const [playing, setPlaying] = useState(false)
  const video = encodeURIComponent(id)

  return (
    <figure className={cn("my-6", className)}>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
        {playing ? (
          <iframe
            ref={(frame) => frame?.focus()}
            src={`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} data-umami-event="video-play" data-umami-event-lesson={lesson} className="group absolute inset-0 block size-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- poster stays a plain img so no YouTube host joins next/image */}
            <img
              src={`https://i.ytimg.com/vi/${video}/hqdefault.jpg`}
              width={480}
              height={360}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
            <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg bg-background px-4 py-2 text-small font-medium text-foreground group-hover:underline">
              <Play className="size-4" strokeWidth={1.5} aria-hidden />
              Play video<span className="sr-only">: {title}</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-caption text-muted-foreground">{title}</figcaption>
    </figure>
  )
}

export default YouTubeFacade
