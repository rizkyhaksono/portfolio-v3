"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlateFigure } from "@/components/ui/plate-figure"
import { canOptimizeImage } from "@/lib/image-hosts"

interface ProjectImageViewerProps {
  src: string
  alt: string
}

/** The cover as a plate, cropped for the column; selecting it opens the whole image in a dialog. */
export default function ProjectImageViewer({ src, alt }: Readonly<ProjectImageViewerProps>) {
  return (
    <Dialog>
      <PlateFigure caption="Select the image to see it uncropped.">
        <DialogTrigger asChild>
          <button type="button" aria-label={`View the full image: ${alt}`} className="relative block aspect-[16/10] w-full cursor-zoom-in">
            {/* `!`: the plate already frames it, so `.prose img`'s own frame must not apply. */}
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 66ch, 100vw"
              className="!border-0 object-cover object-left-top !p-0"
              priority
              unoptimized={!canOptimizeImage(src)}
            />
          </button>
        </DialogTrigger>
      </PlateFigure>
      <DialogContent className="max-w-[min(95vw,64rem)] p-3 pt-12">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <PlateFigure className="mx-auto w-fit max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- natural size, uncropped */}
          <img src={src} alt={alt} className="mx-auto max-h-[80svh] w-auto max-w-full object-contain" />
        </PlateFigure>
      </DialogContent>
    </Dialog>
  )
}
