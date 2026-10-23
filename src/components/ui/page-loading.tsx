import { StatusLine } from "@/components/ui/status-line"

interface PageLoadingProps {
  /** The route's own h1, so the head is in place before the data arrives. Articles leave it out. */
  title?: string
  children: React.ReactNode
}

/** A route's `loading.tsx`: its page head and one line in words. No spinner, no pulse. */
export function PageLoading({ title, children }: Readonly<PageLoadingProps>) {
  return (
    <div aria-busy="true">
      {title && (
        <>
          <header className="pb-8">
            <h1 className="font-display text-h1 text-balance text-ink">{title}</h1>
          </header>
          <div aria-hidden className="border-t border-ink" />
        </>
      )}
      <StatusLine kind="loading" className={title ? "mt-8" : undefined}>
        {children}
      </StatusLine>
    </div>
  )
}
