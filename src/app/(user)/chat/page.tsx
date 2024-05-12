import { getCookieValue } from "@/lib/cookie-helper"

export default async function ChatPage() {
  const cookie = await getCookieValue("USER_SUPABASE_AUTH_COOKIE")
  let user = null

  if (cookie) {
    user = "Logged in"
  }

  return (
    <div>
      <h1>Chat</h1>
      <p>{user}</p>
    </div>
  )
}
