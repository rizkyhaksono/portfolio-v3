"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { MoonIcon, SunIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getCookieValue } from "@/lib/cookie-helper"

export default function Header() {
  const { setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const pathname = usePathname()

  const checkUser = useCallback(async () => {
    const cookie = await getCookieValue("USER_SUPABASE_AUTH_COOKIE")
    if (cookie) {
      console.log("User is logged in")
      setLoggedIn(true)
    } else {
      console.log("User is not logged in")
    }
  }, [])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between h-14 items-center">
        <Link href={"/"} className="font-semibold">
          Rizky Haksono
        </Link>
        <Sheet onOpenChange={() => setMenuOpen(!menuOpen)}>
          <SheetTrigger className="md:hidden">
            <HamburgerMenuIcon />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>
                <Link href={"/"}>Rizky Haksono</Link>
              </SheetTitle>
              <SheetDescription>
                <div className="flex justify-center items-center gap-5">
                  <Link href={"/blog"} className={pathname === "/blog" ? "underline underline-offset-8" : ""}>
                    Blog
                  </Link>
                  {loggedIn ? (
                    <Link href={"/Chat"}>Chat</Link>
                  ) : (
                    <div className="flex gap-1 items-center">
                      <Button variant={"outline"}>
                        <Link href={"/auth/register"}>Register</Link>
                      </Button>
                      <Button>
                        <Link href={"/auth/login"}>Login</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div className="md:flex gap-5 items-center hidden">
          <Link href={"/blog"} className={pathname === "/blog" ? "underline underline-offset-8" : ""}>
            Blog
          </Link>
          {loggedIn ? (
            <Link href={"/Chat"}>Chat</Link>
          ) : (
            <div className="flex gap-1 items-center">
              <Button variant={"outline"}>
                <Link href={"/auth/register"}>Register</Link>
              </Button>
              <Button>
                <Link href={"/auth/login"}>Login</Link>
              </Button>
            </div>
          )}
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
      <Separator className="mb-5" />
    </>
  )
}
