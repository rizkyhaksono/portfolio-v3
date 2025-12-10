"use client"

import { useReducer, useState, useEffect } from "react"
import emailjs from "@emailjs/browser"
import { toast } from "sonner"
import { Turnstile } from "@marsidev/react-turnstile"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BlurFade from "@/components/magicui/blur-fade"
import { checkContactRateLimit, recordContactSubmission, formatRemainingTime } from "@/commons/helpers/rate-limit"
import { media_socials } from "@/commons/constants/contact"
import { cn } from "@/lib/utils"
import { Mail, MessageSquare, Send, Clock } from "lucide-react"
import Link from "next/link"

const initialState = {
  email: "",
  name: "",
  message: "",
}

type FormAction = { type: "SET_EMAIL"; payload: string } | { type: "SET_NAME"; payload: string } | { type: "SET_MESSAGE"; payload: string } | { type: "RESET" }

interface FormState {
  email: string
  name: string
  message: string
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload }
    case "SET_NAME":
      return { ...state, name: action.payload }
    case "SET_MESSAGE":
      return { ...state, message: action.payload }
    case "RESET":
      return initialState
    default:
      return state
  }
}

export default function ContactSection() {
  const [formState, dispatch] = useReducer(formReducer, initialState)
  const [turnstileToken, setTurnstileToken] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null)

  useEffect(() => {
    const rateLimitStatus = checkContactRateLimit()
    if (!rateLimitStatus.allowed && rateLimitStatus.remainingTime) {
      setRateLimitRemaining(rateLimitStatus.remainingTime)
    }
  }, [])

  useEffect(() => {
    if (rateLimitRemaining && rateLimitRemaining > 0) {
      const timer = setInterval(() => {
        setRateLimitRemaining((prev) => {
          if (prev && prev > 1) {
            return prev - 1
          }
          return null
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [rateLimitRemaining])

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const rateLimitStatus = checkContactRateLimit()
    if (!rateLimitStatus.allowed && rateLimitStatus.remainingTime) {
      toast.error(`Please wait ${formatRemainingTime(rateLimitStatus.remainingTime)} before sending another message`)
      setRateLimitRemaining(rateLimitStatus.remainingTime)
      return
    }

    if (!turnstileToken) {
      toast.error("Please complete the CAPTCHA verification")
      return
    }

    setIsSubmitting(true)

    const params = {
      email: formState.email,
      name: formState.name,
      message: formState.message,
    }

    try {
      toast.promise(emailjs.send(process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "", process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID ?? "", params, process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? ""), {
        loading: "Sending email...",
        success: () => {
          dispatch({ type: "RESET" })
          setTurnstileToken("")
          recordContactSubmission()
          setRateLimitRemaining(300)
          return "Email sent successfully! Please wait 5 minutes before sending another message."
        },
        error: () => {
          return "Failed to send email. Please try again."
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormDisabled = isSubmitting || (rateLimitRemaining !== null && rateLimitRemaining > 0)

  const renderButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <span className="animate-spin">⏳</span> Sending...
        </>
      )
    }

    if (rateLimitRemaining !== null && rateLimitRemaining > 0) {
      return (
        <>
          <Clock className="size-4" />
          Wait {formatRemainingTime(rateLimitRemaining)}
        </>
      )
    }

    return (
      <>
        <Send className="size-4" />
        Send Message
      </>
    )
  }

  return (
    <BlurFade delay={0.25} inView>
      <section id="contact-section" className="mt-10 scroll-mt-20">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
            <h2 className="text-2xl font-bold">Get In Touch</h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base ml-3">Feel free to reach out — I&apos;m always open to discussing new projects, opportunities, or just having a chat!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          {/* Left Side - Social Cards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <BlurFade delay={0.3} inView className="flex-1">
              <Card className="h-full overflow-hidden border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="size-5 text-primary" />
                    Connect With Me
                  </CardTitle>
                  <CardDescription>Find me on these platforms</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3">
                  {media_socials.map((social, index) => (
                    <BlurFade key={social.title} delay={0.35 + index * 0.05} inView>
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group flex items-center gap-3 p-3 rounded-xl border border-border/50",
                          "bg-background/50 hover:bg-accent/50 hover:border-primary/30",
                          "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <social.icon className="size-4 text-primary" />
                        </div>
                        <span className="font-medium text-xs">{social.title}</span>
                      </Link>
                    </BlurFade>
                  ))}
                </CardContent>
              </Card>
            </BlurFade>

            {/* Quick Info Card */}
            <BlurFade delay={0.5} inView>
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Prefer email?</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Use the form or reach out at{" "}
                        <a href="mailto:mrizkyhaksono@gmail.com" className="text-primary hover:underline">
                          mrizkyhaksono@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          </div>

          {/* Right Side - Contact Form */}
          <div className="md:col-span-3">
            <BlurFade delay={0.4} inView className="h-full">
              <Card className="h-full border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="size-5 text-primary" />
                    Send a Message
                  </CardTitle>
                  <CardDescription>I&apos;ll get back to you as soon as possible</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Rate Limit Warning */}
                  {rateLimitRemaining !== null && rateLimitRemaining > 0 && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
                      <Clock className="size-4 shrink-0" />
                      <p>Please wait {formatRemainingTime(rateLimitRemaining)} before sending another message.</p>
                    </div>
                  )}

                  <form onSubmit={sendEmail} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formState.email}
                          onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
                          disabled={isFormDisabled}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input id="name" type="text" placeholder="Your name" value={formState.name} onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })} disabled={isFormDisabled} required className="bg-background/50" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project or just say hi..."
                        className="min-h-[150px] resize-none bg-background/50"
                        value={formState.message}
                        onChange={(e) => dispatch({ type: "SET_MESSAGE", payload: e.target.value })}
                        disabled={isFormDisabled}
                        required
                      />
                    </div>

                    {/* Cloudflare Turnstile */}
                    <div className="flex justify-start">
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => setTurnstileToken("")}
                        onExpire={() => setTurnstileToken("")}
                        options={{
                          theme: "auto",
                          size: "normal",
                        }}
                      />
                    </div>

                    <Button type="submit" disabled={!turnstileToken || isFormDisabled} className="w-full md:w-auto gap-2">
                      {renderButtonContent()}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </div>
      </section>
    </BlurFade>
  )
}
