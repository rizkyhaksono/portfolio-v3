"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getReactions, addReaction, type ReactionTarget } from "@/services/visitor/reactions"

export default function ClapButton({
  targetType,
  targetId,
  className,
}: {
  targetType: ReactionTarget
  targetId: string
  className?: string
}) {
  const [count, setCount] = useState(0)
  const [reacted, setReacted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    let active = true
    getReactions(targetType, targetId).then((s) => {
      if (active) {
        setCount(s.count)
        setReacted(s.reacted)
      }
    })
    return () => {
      active = false
    }
  }, [targetType, targetId])

  const clap = async () => {
    if (reacted || loading) return
    setLoading(true)
    setReacted(true)
    setCount((c) => c + 1)
    setBurst(true)
    setTimeout(() => setBurst(false), 400)
    try {
      const s = await addReaction(targetType, targetId)
      setCount(s.count)
      setReacted(s.reacted)
    } catch (err) {
      setReacted(false)
      setCount((c) => Math.max(0, c - 1))
      toast.error(err instanceof Error ? err.message : "Could not react.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={clap}
      disabled={reacted || loading}
      aria-label={reacted ? "You clapped" : "Clap"}
      title={reacted ? "Thanks for the clap!" : "Clap"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:cursor-default",
        reacted ? "border-primary/40 bg-primary/10 text-primary" : "border-border/60 hover:border-primary/40 hover:bg-muted",
        className,
      )}
    >
      <span className={cn("text-base transition-transform", burst && "scale-125")}>👏</span>
      <span className="font-medium tabular-nums">{count}</span>
    </button>
  )
}
