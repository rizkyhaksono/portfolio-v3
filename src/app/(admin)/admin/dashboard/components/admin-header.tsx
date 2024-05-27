"use client"

import { useState, useEffect, useCallback } from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCookieValue } from "@/lib/cookie-helper"

export default function AdminHeader() {
  const { setTheme } = useTheme()
  const [loggedIn, setLoggedIn] = useState(false)

  const checkAdmin = useCallback(async () => {
    const cookie = await getCookieValue("ADMIN_SUPABASE_AUTH_COOKIE")
    if (cookie) {
      console.log("Admin is logged in")
      setLoggedIn(true)
    } else {
      console.log("Admin is not logged in")
    }
  }, [])

  useEffect(() => {
    checkAdmin()
  }, [checkAdmin])

  return (
    <header className="px-4 sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-end sm:py-3 items-center">
      <div className="sm:flex gap-5 items-center hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
