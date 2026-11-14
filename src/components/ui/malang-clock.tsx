"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/** The hour in Malang. Empty until mount (the server has no clock to match). */
export function MalangClock({ className }: Readonly<{ className?: string }>) {
  const [time, setTime] = useState("")
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })
    const update = () => setTime(format.format(new Date()))
    update()
    const id = window.setInterval(update, 30 * 1000)
    return () => window.clearInterval(id)
  }, [])
  return <span className={cn("tabular-nums", className)}>{time ? `${time} in Malang` : " "}</span>
}
