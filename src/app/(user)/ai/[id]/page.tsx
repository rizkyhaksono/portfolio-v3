import { redirect } from "next/navigation"

interface AIChatRedirectProps {
  params: Promise<{ id: string }>
}

/** Old per-chat links: the chat now opens inside /ai. */
export default async function AIChatRedirect({ params }: Readonly<AIChatRedirectProps>) {
  const { id } = await params
  redirect(`/ai?chat=${encodeURIComponent(id)}`)
}
