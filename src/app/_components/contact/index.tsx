"use client";

import { useReducer, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CardContact from "./card-contact";
import BlurFade from "@/components/magicui/blur-fade";
import {
  checkContactRateLimit,
  recordContactSubmission,
  formatRemainingTime,
} from "@/commons/helpers/rate-limit";

const initialState = {
  email: "",
  name: "",
  message: "",
};

type FormAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "RESET" };

interface FormState {
  email: string;
  name: string;
  message: string;
}

function formReducer(state: FormState, action: FormAction): FormState {
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
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Check rate limit on mount
    const rateLimitStatus = checkContactRateLimit();
    if (!rateLimitStatus.allowed && rateLimitStatus.remainingTime) {
      setRateLimitRemaining(rateLimitStatus.remainingTime);
    }
  }, []);

  useEffect(() => {
    // Countdown timer for rate limit
    if (rateLimitRemaining && rateLimitRemaining > 0) {
      const timer = setInterval(() => {
        setRateLimitRemaining((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          }
          return null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [rateLimitRemaining]);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check rate limit
    const rateLimitStatus = checkContactRateLimit();
    if (!rateLimitStatus.allowed && rateLimitStatus.remainingTime) {
      toast.error(
        `Please wait ${formatRemainingTime(
          rateLimitStatus.remainingTime
        )} before sending another message`
      );
      setRateLimitRemaining(rateLimitStatus.remainingTime);
      return;
    }

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

    try {
      await toast.promise(
        emailjs.send(
          process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
          process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID ?? "",
          params,
          process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? ""
        ),
        {
          loading: "Sending email...",
          success: () => {
            dispatch({ type: "RESET" });
            setTurnstileToken("");
            recordContactSubmission();
            setRateLimitRemaining(300); // 5 minutes
            return "Email sent successfully! Please wait 5 minutes before sending another message.";
          },
          error: () => {
            return "Failed to send email. Please try again.";
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || (rateLimitRemaining !== null && rateLimitRemaining > 0);

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Contact</p>
        <p className="flex justify-start text-sm text-muted-foreground">
          {`Feel free to get in touch and let's have a discussion about how we can work together.`}
        </p>
        <Separator className="my-5" />
        <p className="text-left text-base font-semibold">
          Find me on social media
        </p>
        <div className="mt-5 grid grid-cols-2 items-start justify-start gap-2 sm:grid-cols-4">
          <CardContact />
        </div>
        <Separator className="my-5" />
        <p className="text-left text-base font-semibold">
          Or send me a message
        </p>
        {rateLimitRemaining !== null && rateLimitRemaining > 0 && (
          <div className="mt-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
            Please wait {formatRemainingTime(rateLimitRemaining)} before sending
            another message.
          </div>
        )}
        <div className="mt-5 flex justify-start">
          <form className="mx-1 w-full" onSubmit={sendEmail}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 md:flex-row">
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  value={formState.email}
                  onChange={(e) =>
                    dispatch({ type: "SET_EMAIL", payload: e.target.value })
                  }
                  disabled={isFormDisabled}
                  required
                />
                <Input
                  type="text"
                  placeholder="example name"
                  value={formState.name}
                  onChange={(e) =>
                    dispatch({ type: "SET_NAME", payload: e.target.value })
                  }
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <Textarea
                placeholder="i'd like to discuss..."
                className="h-60"
                value={formState.message}
                onChange={(e) =>
                  dispatch({ type: "SET_MESSAGE", payload: e.target.value })
                }
                disabled={isFormDisabled}
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
                disabled={!turnstileToken || isFormDisabled}
              >
                {isSubmitting
                  ? "Sending..."
                  : rateLimitRemaining !== null && rateLimitRemaining > 0
                    ? `Wait ${formatRemainingTime(rateLimitRemaining)}`
                    : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BlurFade>
  );
}