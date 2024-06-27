"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { MoonIcon, SunIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCookieValue } from "@/lib/cookie-helper";

export default function Header() {
  const { setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  const checkUser = useCallback(async () => {
    const cookie = await getCookieValue("USER_SUPABASE_AUTH_COOKIE");
    if (cookie) {
      console.log("User is logged in");
      setLoggedIn(true);
    } else {
      console.log("User is not logged in");
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-white dark:supports-[backdrop-filter]:bg-muted/0 flex justify-between h-14 items-center">
        <Link href={"/"} className="font-semibold">
          Rizky Haksono
        </Link>
        <Sheet onOpenChange={() => setMenuOpen(!menuOpen)}>
          <SheetTrigger className="md:hidden">
            <HamburgerMenuIcon />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle className="text-start">
                <Link href={"/"}>Rizky Haksono</Link>
              </SheetTitle>
              <div className="flex flex-col items-start">
                {loggedIn ? (
                  <Link href={"/Chat"}>Chat</Link>
                ) : (
                  <div className="flex gap-2 items-center justify-center w-full">
                    <Button variant={"outline"} className="w-full">
                      <Link href={"/auth/register"}>Register</Link>
                    </Button>
                    <Button variant={"default"} className="w-full">
                      <Link href={"/auth/login"}>Login</Link>
                    </Button>
                  </div>
                )}
                <Link href={"/"} className={pathname === "/" ? "underline underline-offset-8 mt-5" : "mt-5"}>
                  Home
                </Link>
                <Link href={"/blog"} className={pathname === "/blog" ? "underline underline-offset-8 mt-2" : "mt-2"}>
                  Blog
                </Link>
              </div>
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
              <Button variant={"default"}>
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
  );
}
