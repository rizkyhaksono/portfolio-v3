import { UMAMI_BEFORE_SEND } from "@/lib/umami-before-send"

/** Inlines the Umami `data-before-send` hook as a classic script (required by the tracker). */
export function UmamiBootstrapScript({ nonce }: Readonly<{ nonce?: string }>) {
  const bootstrap = UMAMI_BEFORE_SEND
  // skipcq: JS-0440 -- static tracker hook from lib/umami-before-send, not user HTML
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: bootstrap }} />
}