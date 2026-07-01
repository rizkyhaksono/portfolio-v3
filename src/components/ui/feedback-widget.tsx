"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitFeedback, type FeedbackCategory } from "@/services/visitor/feedback"
import { MessageSquarePlus, Loader2 } from "lucide-react"

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
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-border/60 bg-card/95 px-3 py-2 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground supports-[backdrop-filter]:bg-card/80 print:hidden"
      >
        <MessageSquarePlus className="h-4 w-4" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback &amp; suggestions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={category} onValueChange={(v) => setCategory(v as FeedbackCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">Suggest a topic / idea</SelectItem>
                <SelectItem value="bug">Report a bug</SelectItem>
                <SelectItem value="general">General feedback</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              autoFocus
              placeholder="What should I build or write next? Found something broken?"
              value={message}
              maxLength={2000}
              rows={4}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email (optional, if you want a reply)"
              value={email}
              maxLength={200}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={sending || !message.trim()} className="gap-2">
              {sending && <Loader2 className="h-4 w-4 animate-spin" />} Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
