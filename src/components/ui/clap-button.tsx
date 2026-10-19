"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { buttonVariants } from "@/components/ui/button"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { getReactions, addReaction, type ReactionTarget } from "@/services/visitor/reactions"

/** One clap per reader. State by shape and word: outline "Clap", then solid "Clapped". */
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
    try {
      const s = await addReaction(targetType, targetId)
      setCount(s.count)
      setReacted(s.reacted)
      track("clap", { kind: targetType })
    } catch {
      setReacted(false)
      setCount((c) => Math.max(0, c - 1))
      toast.error("The clap did not go through. Try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={clap}
      disabled={reacted || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant: reacted ? "default" : "outline" }), "disabled:opacity-100", className)}
    >
      {reacted ? "Clapped" : "Clap"}
      <span className="border-l border-current pl-2 tabular-nums">
        {count.toLocaleString("en")}
        <span className="sr-only"> {count === 1 ? "clap" : "claps"} so far</span>
      </span>
    </button>
  )
}
