import { getCookieValue } from "@/lib/cookie-helper"

export default async function ChatPage() {
  const cookie = await getCookieValue("USER_SUPABASE_AUTH_COOKIE")
  let user = null

  if (cookie) {
    user = "Logged in"
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p>Working on</p>
      <p>{user}</p>
    </div>
  )
}
