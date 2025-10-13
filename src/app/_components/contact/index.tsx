"use client"

import { useReducer, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner"
import { Turnstile } from "@marsidev/react-turnstile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import CardContact from "./card-contact";
import BlurFade from "@/components/magicui/blur-fade";

const initialState = {
  email: "",
  name: "",
  message: "",
};

function formReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function ContactSection() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = (e: any) => {
    e.preventDefault();

    if (!turnstileToken) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    const params = {
      email: formState.email,
      name: formState.name,
      message: formState.message,
    };

    toast.promise(emailjs.send(
      process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
      process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID ?? "",
      params,
      process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? ""
    ), {
      loading: "Sending email...",
      success: () => {
        dispatch({ type: "RESET" });
        setTurnstileToken("");
        setIsSubmitting(false);
        return "Email sent successfully"
      },
      error: () => {
        setIsSubmitting(false);
        return "Failed to send email"
      }
    })
  };

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Contact</p>
        <p className="flex justify-start text-muted-foreground text-sm">
          {`Feel free to get in touch and let's have a discussion about how we can work together.`}
        </p>
        <Separator className="my-5" />
        <p className="text-left text-base font-semibold">
          Find me on social media
        </p>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 items-start justify-start">
          <CardContact />
        </div>
        <Separator className="my-5" />
        <p className="text-left text-base font-semibold">
          Or send me a message
        </p>
        <div className="flex justify-start mt-5">
          <form className="w-full" onSubmit={sendEmail}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  value={formState.email}
                  onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  placeholder="example name"
                  value={formState.name}
                  onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                  required
                />
              </div>
              <Textarea
                placeholder="i'd like to discuss..."
                className="h-60"
                value={formState.message}
                onChange={(e) => dispatch({ type: "SET_MESSAGE", payload: e.target.value })}
                required
              />

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

              <Button
                type="submit"
                variant={"default"}
                size={"sm"}
                disabled={!turnstileToken || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BlurFade>
  )
}