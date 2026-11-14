"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  /** Fence language, sent as the event's `lang`. */
  lang?: string;
}

/**
 * Copies a code block. Hidden until the block is hovered or focused (always shown on touch screens and while it
 * says Copied); the word changes with the state, so it never relies on the icon alone.
 */
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
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 rounded-md bg-muted px-2 text-caption text-muted-foreground opacity-0 transition duration-ui ease-out hover:bg-tint-strong hover:text-foreground focus-visible:opacity-100 group-focus-within/code:opacity-100 group-hover/code:opacity-100 [@media(hover:none)]:opacity-100 [@media(pointer:coarse)]:min-h-11",
        copied && "opacity-100",
      )}
    >
      <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
