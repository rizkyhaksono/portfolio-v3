"use client"

import { useRef, useState, type FormEvent } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { track } from "@/lib/analytics"
import { checkContactRateLimit, formatRemainingTime, recordContactSubmission } from "@/commons/helpers/rate-limit"

// Cloudflare's script loads only once someone starts filling the form in.
const Turnstile = dynamic(() => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile), { ssr: false })

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string }

export function ContactForm() {
  const [armed, setArmed] = useState(false)
  const [token, setToken] = useState("")
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const sending = useRef(false)
  // The site theme, not the OS one: Night on a light OS must still get the dark widget.
  const { resolvedTheme } = useTheme()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // A ref, not state: a second click in the same tick must not send twice.
    if (sending.current) return
    const form = event.currentTarget

    const limit = checkContactRateLimit()
    if (!limit.allowed) {
      track("contact-send", { status: "limited" })
      setStatus({ kind: "error", message: `You sent a message a moment ago. Try again in ${formatRemainingTime(limit.remainingTime ?? 0)}.` })
      return
    }
    if (!token) {
      setStatus({ kind: "error", message: "Wait for the check above the button to finish, then send again." })
      return
    }

    // Read before "sending" re-renders the fields as disabled, which would drop them from FormData.
    const data = new FormData(form)
    const fields = { email: data.get("email"), name: data.get("name"), message: data.get("message") }
    sending.current = true
    setStatus({ kind: "sending" })
    try {
      const { default: emailjs } = await import("@emailjs/browser")
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID ?? "",
        fields,
        process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? "",
      )
      recordContactSubmission()
      form.reset()
      setToken("")
      setStatus({ kind: "sent" })
      track("contact-send", { status: "ok" })
    } catch {
      setStatus({ kind: "error", message: "The message did not send. Try again, or write to the address on the left." })
      track("contact-send", { status: "error" })
    } finally {
      sending.current = false
    }
  }

  const busy = status.kind === "sending"

  return (
    <form onSubmit={onSubmit} onFocus={() => setArmed(true)} aria-describedby="contact-status" className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="contact-email">Your email</Label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" required disabled={busy} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="contact-name">Your name</Label>
          <Input id="contact-name" name="name" autoComplete="name" required disabled={busy} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" rows={6} maxLength={5000} required disabled={busy} className="resize-y" />
      </div>

      {/* Reserved at the widget's height so mounting it does not shift the button. */}
      <div className="min-h-[65px]">
        {armed && (
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            onSuccess={setToken}
            onError={() => setToken("")}
            onExpire={() => setToken("")}
            options={{ theme: resolvedTheme === "dark" ? "dark" : "light" }}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send the message"}
        </Button>
        <p id="contact-status" aria-live="polite" className="flex items-start gap-1.5 font-display text-small text-ink">
          {status.kind === "sent" && (
            <>
              <Check aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
              Thank you. The message is on its way, and I will reply by email.
            </>
          )}
          {status.kind === "error" && (
            <>
              <X aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
              {status.message}
            </>
          )}
        </p>
      </div>
    </form>
  )
}
