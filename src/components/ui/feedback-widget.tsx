"use client"

import { useId, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitFeedback, type FeedbackCategory } from "@/services/visitor/feedback"

interface FeedbackWidgetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
}

/** Controlled by DeferredClientUtilities, which opens it from any `[data-open-feedback]` button. */
export default function FeedbackWidget({ open, onOpenChange: setOpen, onCloseAutoFocus }: Readonly<FeedbackWidgetProps>) {
  const [category, setCategory] = useState<FeedbackCategory>("suggestion")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const id = useId()

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
      toast.success("Thank you. The note is in.")
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-sm:mt-4" onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader>
          <DialogTitle>Feedback and suggestions</DialogTitle>
          <DialogDescription>What should I build or write next? Found something broken?</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor={`${id}-category`}>Kind of note</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as FeedbackCategory)}>
              <SelectTrigger id={`${id}-category`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">A topic or an idea</SelectItem>
                <SelectItem value="bug">Something is broken</SelectItem>
                <SelectItem value="general">General feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${id}-message`}>Message</Label>
            <Textarea
              id={`${id}-message`}
              autoFocus
              value={message}
              maxLength={2000}
              rows={4}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${id}-email`}>Your email, if you want a reply</Label>
            <Input
              id={`${id}-email`}
              type="email"
              autoComplete="email"
              value={email}
              maxLength={200}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={sending || !message.trim()} aria-busy={sending}>
            {sending ? "Sending…" : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
