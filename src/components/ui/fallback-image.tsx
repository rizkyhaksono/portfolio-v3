"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string
}

export function FallbackImage({ src, alt, className, fallbackClassName, ...props }: Readonly<FallbackImageProps>) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className, fallbackClassName)} style={{ width: props.width, height: props.height }} aria-label={alt}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 opacity-50">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    )
  }

  return <Image src={src} alt={alt} className={className} unoptimized onError={() => setHasError(true)} {...props} />
}
