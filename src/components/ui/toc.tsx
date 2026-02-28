"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"

interface HeadingData {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingData[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Find all h2 and h3 elements inside the article
    const elements = Array.from(document.querySelectorAll("article h2, article h3"))
      .map((elem) => ({
        id: elem.id,
        text: elem.textContent || "",
        level: Number(elem.tagName.charAt(1)),
      }))
      .filter((h) => h.id)

    setHeadings(elements)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" }, // trigger when heading is near the top
    )

    document.querySelectorAll("article h2, article h3").forEach((elem) => {
      observer.observe(elem)
    })

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-24 space-y-4">
      <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
        <List className="h-4 w-4" />
        On this page
      </div>
      <ul className="space-y-3 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={cn("transition-all hover:text-foreground line-clamp-2", heading.level === 3 ? "pl-4 text-xs" : "", activeId === heading.id ? "text-primary font-medium translate-x-1" : "text-muted-foreground")}>
            <a href={`#${heading.id}`} className="block w-full">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
