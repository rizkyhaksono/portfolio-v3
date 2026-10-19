"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  /** Fence language, sent as the event's `lang`. */
  lang?: string;
}

/** Copies a code specimen. The word changes with the state, so it never relies on the icon alone. */
export default function CopyButton({ text, lang }: Readonly<CopyButtonProps>) {
  const [copied, setCopied] = useState(false);

  const copy = () =>
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      data-umami-event="Click Copy Code"
      data-umami-event-lang={lang}
      className="inline-flex items-center gap-1.5 text-caption text-ink underline-offset-[0.18em] hover:underline active:translate-y-px [@media(pointer:coarse)]:min-h-11"
    >
      <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
