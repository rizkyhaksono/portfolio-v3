import { EMAIL } from "@/commons/constants/contact"
import { InkLink } from "@/components/ui/ink-link"
import { MalangClock } from "@/components/ui/sky"
import { cn } from "@/lib/utils"

/** The end of a page: one quiet line with the year, the hour in Malang and the address. The sidebar holds the links. */
export default function Footer({ className }: Readonly<{ className?: string }>) {
  return (
    <footer data-print-hide className={cn("pb-10", className)}>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 text-caption text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Rizky Haksono. <MalangClock />
        </p>
        <p>
          <InkLink href={`mailto:${EMAIL}`} event="email-click" eventData={{ area: "colophon" }} className="relative text-muted-foreground after:absolute after:-inset-3">
            {EMAIL}
          </InkLink>
        </p>
      </div>
    </footer>
  )
}
