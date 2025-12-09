"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { FallbackImage } from "./fallback-image"

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string
    name: string
    title: string
    image?: string
  }[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)

  useEffect(() => {
    addAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, speed])

  const [start, setStart] = useState(false)

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      // Clear duplicates first to avoid adding duplicates on re-render
      const itemCount = items.length
      while (scrollerRef.current.children.length > itemCount) {
        scrollerRef.current.removeChild(scrollerRef.current.lastChild!)
      }

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      setStart(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]", className)}
      style={
        {
          "--animation-duration": speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s",
          "--animation-direction": direction === "left" ? "forwards" : "reverse",
        } as React.CSSProperties
      }
    >
      <ul ref={scrollerRef} className={cn("flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4", start && "animate-scroll", pauseOnHover && "hover:[animation-play-state:paused]")}>
        {items.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-8 py-6 md:w-[450px] dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
            key={`${item.name}-${idx}`}
          >
            <blockquote>
              <div aria-hidden="true" className="user-select-none pointer-events-none absolute -left-0.5 -top-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
              <span className="relative z-20 text-sm font-normal leading-[1.6] text-neutral-800 dark:text-gray-100">{item.quote}</span>
              <div className="relative z-20 mt-6 flex flex-row items-center gap-3">
                {item.image && <FallbackImage src={item.image} alt={item.name} width={40} height={40} className="rounded-full" />}
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold leading-[1.6] text-neutral-800 dark:text-gray-100">{item.name}</span>
                  <span className="text-sm font-normal leading-[1.6] text-neutral-500 dark:text-gray-400">{item.title}</span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  )
}
