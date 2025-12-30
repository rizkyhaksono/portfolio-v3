import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="w-full pt-5 pb-24 sm:pb-32">
      <Separator className="mt-5" />
      <div className="flex w-full flex-col items-center justify-between gap-5 my-5 sm:flex-row">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <p>
            Copyright © {currentYear}{" "}
            <Link href="https://github.com/rizkyhaksono" className="underline underline-offset-2 hover:text-primary transition-colors" target="_blank">
              Rizky Haksono
            </Link>
            . All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/legal/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors underline underline-offset-2">
            Terms of Service
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/legal/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
