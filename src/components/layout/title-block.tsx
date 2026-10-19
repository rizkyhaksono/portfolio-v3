import { JOB_TITLE } from "@/commons/constants/author"
import { Logo } from "@/components/ui/logo"
import { getAllChangelogs } from "@/lib/mdx"
import { cn } from "@/lib/utils"

const EMAIL = "mrizkyhaksono@gmail.com"

function Cell({ label, className, children }: Readonly<{ label: string; className?: string; children: React.ReactNode }>) {
  return (
    <div className={cn("bg-paper px-3 py-2.5", className)}>
      <dt className="text-caption text-ink-soft">{label}</dt>
      <dd className="mt-0.5 break-words text-balance font-mono text-small text-ink">{children}</dd>
    </div>
  )
}

/** Colophon as an engineering title block: the mark, then ruled cells of label over value. Revision is the newest changelog entry. */
export function TitleBlock() {
  const latest = getAllChangelogs()[0]?.meta

  return (
    <div className="border border-ink md:flex">
      <div className="flex items-center justify-center border-b border-rule p-4 md:border-b-0 md:border-r md:px-8">
        <Logo variant="mark" className="w-20 md:w-24" />
      </div>
      <dl className="grid grow grid-cols-2 gap-px bg-rule md:grid-cols-3">
        <Cell label="Drawn by">Rizky Haksono</Cell>
        <Cell label="Role">{JOB_TITLE}, Sarana AI</Cell>
        <Cell label="Location">Malang, East Java</Cell>
        {latest && <Cell label="Revision">{latest.version}, <span className="whitespace-nowrap">{latest.date}</span></Cell>}
        <Cell label="Set in" className="col-span-2 md:col-span-1">
          IBM Plex Sans and IBM Plex Mono
        </Cell>
        <Cell label="Contact" className="col-span-2 md:col-span-1">
          <a
            href={`mailto:${EMAIL}`}
            data-track="email-click"
            data-track-area="colophon"
            className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-[0.18em] hover:decoration-2 md:min-h-0"
          >
            {EMAIL}
          </a>
        </Cell>
      </dl>
    </div>
  )
}
