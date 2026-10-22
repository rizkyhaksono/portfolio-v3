"use client"

import { useRef, useState, type FormEvent } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FieldMessage } from "@/components/ui/field-message"
import { track } from "@/lib/analytics"
import { checkContactRateLimit, formatRemainingTime, recordContactSubmission } from "@/commons/helpers/rate-limit"

// Cloudflare's script loads only once someone starts filling the form in.
const Turnstile = dynamic(() => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile), { ssr: false })

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string }
type Field = "email" | "name" | "message"
type FieldElement = HTMLInputElement | HTMLTextAreaElement

const FIELDS: Field[] = ["email", "name", "message"]
const FIELD_ERRORS: Record<Field, (el: FieldElement) => string> = {
  email: (el) => (el.validity.valueMissing ? "Enter your email, so the reply can reach you." : "Enter an email address, like you@example.com."),
  name: () => "Enter your name.",
  message: () => "Write the message first.",
}

const fieldOf = (form: HTMLFormElement, name: Field) => form.elements.namedItem(name) as FieldElement | null

export function ContactForm() {
  const [armed, setArmed] = useState(false)
  const [token, setToken] = useState("")
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const sending = useRef(false)
  // The site theme, not the OS one: Night on a light OS must still get the dark widget.
  const { resolvedTheme } = useTheme()

  /** The browser's own constraints decide; the messages are this site's, under each field. */
  function validate(form: HTMLFormElement) {
    const found: Partial<Record<Field, string>> = {}
    for (const name of FIELDS) {
      const el = fieldOf(form, name)
      if (el && !el.checkValidity()) found[name] = FIELD_ERRORS[name](el)
    }
    setErrors(found)
    const first = FIELDS.find((name) => found[name])
    if (first) fieldOf(form, first)?.focus()
    return !first
  }

  function clearFixed(event: FormEvent<HTMLFormElement>) {
    const el = event.target as FieldElement
    const name = el.name as Field
    if (errors[name] && el.checkValidity()) setErrors(({ [name]: _fixed, ...rest }) => rest)
  }

  const fieldProps = (name: Field) => ({
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  })
  const fieldError = (name: Field) =>
    errors[name] ? <FieldMessage id={`contact-${name}-error`}>{errors[name]}</FieldMessage> : null

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // A ref, not state: a second click in the same tick must not send twice.
    if (sending.current) return
    const form = event.currentTarget
    if (!validate(form)) return

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
      setStatus({ kind: "error", message: "The message did not send. Try again, or write to mrizkyhaksono@gmail.com." })
      track("contact-send", { status: "error" })
    } finally {
      sending.current = false
    }
  }

  const busy = status.kind === "sending"

  return (
    <form
      onSubmit={onSubmit}
      onInput={clearFixed}
      onFocus={() => setArmed(true)}
      noValidate
      data-private
      aria-describedby="contact-status"
      className="space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-email">Your email</Label>
          <Input id="contact-email" type="email" autoComplete="email" required disabled={busy} {...fieldProps("email")} />
          {fieldError("email")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-name">Your name</Label>
          <Input id="contact-name" autoComplete="name" required disabled={busy} {...fieldProps("name")} />
          {fieldError("name")}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={6} maxLength={5000} required disabled={busy} className="resize-y" {...fieldProps("message")} />
        {fieldError("message")}
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
