"use client"

import { Button } from "@/components/ui/button"
import { authLogout } from "@/services/visitor/auth"
import { removeCookie } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = async () => {
    toast.promise(authLogout(), {
      loading: "Back to home...",
      success: async () => {
        await removeCookie("auth_session");
        return "Logged out successfully";
      },
      error: (err) => err,
      finally: () => router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-2">
      Profile Page
      <Button onClick={() => handleLogout()}>
        Log Out
      </Button>
    </div>
  )
}