"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ProjectImageViewerProps {
  src: string
  alt: string
}

/** Cover image with a lightbox: the cover stays cropped (object-cover) for layout,
 *  the dialog shows the full uncropped image. */
export default function ProjectImageViewer({ src, alt }: Readonly<ProjectImageViewerProps>) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="View full image"
          className="group relative block w-full h-[400px] cursor-zoom-in overflow-hidden rounded-lg mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Image src={src} alt={alt} fill className="object-cover" priority />
          {/* View full image affordance — subtle, visible on hover/focus (always on touch) */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
            View full image
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl p-2 sm:p-3">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mx-auto max-h-[82vh] w-auto max-w-full rounded-md object-contain" />
      </DialogContent>
    </Dialog>
  )
}
