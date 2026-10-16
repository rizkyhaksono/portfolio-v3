"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitFeedback, type FeedbackCategory } from "@/services/visitor/feedback"
import { MessageSquarePlus } from "lucide-react"

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<FeedbackCategory>("suggestion")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)

  const submit = async () => {
    if (!message.trim() || sending) return
    setSending(true)
    try {
      await submitFeedback({
        message,
        category,
        email: email.trim() || undefined,
        pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
      })
      toast.success("Thanks for the feedback!")
      setMessage("")
      setEmail("")
      setCategory("suggestion")
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit feedback.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed bottom-4 left-4 z-40 inline-flex h-11 items-center gap-2 border border-ink bg-paper px-3 text-small font-semibold text-ink shadow-[3px_3px_0_hsl(var(--ink))] hover:bg-tint active:translate-y-px print:hidden md:h-9"
      >
        <MessageSquarePlus className="size-4" strokeWidth={1.5} aria-hidden />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback and suggestions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={category} onValueChange={(v) => setCategory(v as FeedbackCategory)}>
              <SelectTrigger aria-label="Category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">Suggest a topic / idea</SelectItem>
                <SelectItem value="bug">Report a bug</SelectItem>
                <SelectItem value="general">General feedback</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              aria-label="Message"
              autoFocus
              placeholder="What should I build or write next? Found something broken?"
              value={message}
              maxLength={2000}
              rows={4}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Input
              aria-label="Email, optional"
              type="email"
              placeholder="Email (optional, if you want a reply)"
              value={email}
              maxLength={200}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={sending || !message.trim()} aria-busy={sending}>
              {sending ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
