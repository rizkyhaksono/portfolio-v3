"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useForm, type DefaultValues, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "sonner"
import { ExternalLink, MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusLine } from "@/components/ui/status-line"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { stripHtml } from "@/components/layout/admin/admin-format"
import { ViewTabs } from "@/components/layout/admin/view-tabs"
import { cn } from "@/lib/utils"

// TipTap only loads once an editor with a rich field opens.
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor").then((m) => m.RichTextEditor), {
  ssr: false,
  loading: () => <Skeleton className="h-48 w-full" />,
})

export type FormValues = Record<string, string | boolean | null | undefined>

export interface Field<V extends FormValues> {
  name: keyof V & string
  label: string
  kind?: "text" | "url" | "textarea" | "rich" | "switch"
  placeholder?: string
  note?: string
  /** Sits beside the next `half` field from the sm breakpoint. */
  half?: boolean
}

export interface RowView {
  title: string
  /** The date column: a duration, a dateline. */
  meta?: string
  /** The property column. Editor HTML is stripped. */
  text?: string | null
  /** A page for the row (the public page, the live project), opened in a new tab. */
  link?: { href: string; label: string } | null
  status?: { word: string; mark: "filled" | "outline" | "dashed" }
}

export interface CollectionProps<T extends { id: string }, V extends FormValues> {
  /** Singular, used in buttons and dialogs: "project", "post". */
  noun: string
  plural: string
  /** Names the table for screen readers. */
  heading: string
  /** Where the rows live and who reads them. */
  note?: string
  /** Head cells of the property and date columns. */
  columns?: { text: string; meta: string }
  schema: z.ZodType<V>
  blank: V
  fields: Field<V>[]
  load: () => Promise<T[]>
  /** Create when `editing` is null, else update. */
  save: (values: V, editing: T | null) => Promise<unknown>
  remove: (item: T) => Promise<unknown>
  toValues: (item: T) => V
  view: (item: T) => RowView
  filters?: { label: string; test: (item: T) => boolean }[]
  /** Extra view actions (export, for example). */
  tools?: (items: T[]) => React.ReactNode
}

const sentence = (word: string) => word.charAt(0).toLocaleUpperCase("en") + word.slice(1)

/** One row's "..." menu: Edit, the public page when there is one, and Delete (which asks first). */
function RowMenu({ title, link, onEdit, onDelete }: Readonly<{ title: string; link?: RowView["link"]; onEdit: () => void; onDelete: () => void }>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-11 text-muted-foreground hover:text-foreground md:size-7" aria-label={`Actions for ${title}`}>
          <MoreHorizontal strokeWidth={1.5} aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil className="size-4" strokeWidth={1.5} aria-hidden />
          Edit
        </DropdownMenuItem>
        {link && (
          <DropdownMenuItem asChild>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden />
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="size-4" strokeWidth={1.5} aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LoadingRows({ label }: Readonly<{ label: string }>) {
  return (
    <div aria-busy="true" aria-label={label} className="mt-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-6 border-b border-border px-2 py-2.5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="hidden h-4 flex-1 md:block" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

/**
 * One admin collection as a Notion database: view tabs for the filters with "New {noun}" on the right, an
 * editor frame above the table when adding or editing, then the table with a "..." menu per row.
 */
export function Collection<T extends { id: string }, V extends FormValues>({
  noun,
  plural,
  heading,
  note,
  columns = { text: "Details", meta: "Date" },
  schema,
  blank,
  fields,
  load,
  save,
  remove,
  toValues,
  view,
  filters,
  tools,
}: Readonly<CollectionProps<T, V>>) {
  const [items, setItems] = useState<T[]>([])
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")
  // null: no editor; "new": adding; an item: editing it.
  const [slip, setSlip] = useState<"new" | T | null>(null)
  const [doomed, setDoomed] = useState<T | null>(null)
  const [filter, setFilter] = useState(0)
  const slipRef = useRef<HTMLDivElement>(null)

  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: blank as DefaultValues<V> })
  const editing = slip !== null && slip !== "new" ? slip : null

  const refresh = useCallback(async () => {
    try {
      setItems(await load())
      setState("ready")
    } catch {
      setState("failed")
    }
  }, [load])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (slip) slipRef.current?.scrollIntoView({ block: "start" })
  }, [slip])

  const open = (item: T | null) => {
    form.reset(item ? toValues(item) : blank)
    setSlip(item ?? "new")
  }

  const close = () => {
    form.reset(blank)
    setSlip(null)
  }

  const onSubmit = async (values: V) => {
    try {
      await save(values, editing)
      toast.success(editing ? `Saved the ${noun}.` : `Added the ${noun}.`)
      close()
      await refresh()
    } catch {
      toast.error(`Could not save the ${noun}. Check the fields and try again.`)
    }
  }

  const onDelete = async (item: T) => {
    try {
      await remove(item)
      toast.success(`Deleted the ${noun}.`)
      if (editing?.id === item.id) close()
      await refresh()
    } catch {
      toast.error(`Could not delete the ${noun}. Try again.`)
    }
  }

  const shown = filters ? items.filter(filters[filter].test) : items
  const rows = shown.map((item) => ({ item, row: view(item) }))
  const hasStatus = rows.some(({ row }) => row.status)
  const submitting = form.formState.isSubmitting

  const actions = (
    <>
      {tools?.(items)}
      <Button size="sm" onClick={() => open(null)} disabled={slip === "new"}>
        <Plus strokeWidth={1.5} aria-hidden />
        New {noun}
      </Button>
    </>
  )

  return (
    <section aria-label={heading} className="w-full">
      {filters && state === "ready" ? (
        <>
          <ViewTabs
            label={`Filter ${plural}`}
            tabs={filters.map(({ label, test }, i) => ({ label, count: items.filter(test).length, current: filter === i, onSelect: () => setFilter(i) }))}
            actions={actions}
          />
          {note && <p className="mt-2 text-caption text-muted-foreground">{note}</p>}
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="min-w-0 text-small text-muted-foreground">
            {state === "ready" && `${items.length} ${items.length === 1 ? noun : plural}. `}
            {note}
          </p>
          <div className="flex items-center gap-1.5">{actions}</div>
        </div>
      )}

      {slip && (
        <div ref={slipRef} className="mt-6 max-w-2xl scroll-mt-16 rounded-lg border border-border p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="min-w-0 text-h3 text-foreground [overflow-wrap:anywhere]">{editing ? view(editing).title : `New ${noun}`}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={close} aria-label="Close the editor" className="-mr-2 -mt-1 text-muted-foreground hover:text-foreground">
              <X strokeWidth={1.5} aria-hidden />
            </Button>
          </div>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="mt-5 grid gap-5 sm:grid-cols-2">
              {fields.map(({ name, label, kind = "text", placeholder, note: hint, half }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as Path<V>}
                  render={({ field }) => (
                    <FormItem className={cn(!half && "sm:col-span-2", kind === "switch" && "flex items-center justify-between gap-4 space-y-0")}>
                      <div className="space-y-1">
                        <FormLabel>{label}</FormLabel>
                        {hint && <FormDescription>{hint}</FormDescription>}
                      </div>
                      {kind === "rich" ? (
                        // The editor is a contenteditable, not a labelable control, so it carries its own name.
                        <RichTextEditor content={String(field.value ?? "")} onChange={field.onChange} placeholder={placeholder} label={label} />
                      ) : (
                        <FormControl>
                          {kind === "switch" ? (
                            <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                          ) : kind === "textarea" ? (
                            <Textarea {...field} value={String(field.value ?? "")} rows={3} placeholder={placeholder} />
                          ) : (
                            <Input {...field} value={String(field.value ?? "")} type={kind} placeholder={placeholder} />
                          )}
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : editing ? `Save ${noun}` : `Add ${noun}`}
                </Button>
                <Button type="button" variant="ghost" onClick={close}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {state === "loading" && <LoadingRows label={`Loading ${plural}`} />}

      {state === "failed" && (
        <StatusLine
          kind="failed"
          className="mt-6"
          action={
            <Button variant="outline" size="sm" onClick={() => { void refresh() }}>
              Try again
            </Button>
          }
        >
          The {plural} did not load. The API may be down for a moment.
        </StatusLine>
      )}

      {state === "ready" &&
        (rows.length === 0 ? (
          <StatusLine kind="empty" className="mt-6">
            {items.length === 0 ? `No ${plural} yet. Add the first one with New ${noun}.` : `No ${plural} match this filter.`}
          </StatusLine>
        ) : (
          <Table aria-label={heading} className={cn("table-fixed", filters ? "mt-2" : "mt-3")}>
            <TableHeader className={cn(filters && "[&_tr]:border-t-0")}>
              <TableRow>
                <TableHead className="w-auto md:w-1/3">Title</TableHead>
                <TableHead className="hidden md:table-cell">{columns.text}</TableHead>
                {hasStatus && <TableHead className="w-28">Status</TableHead>}
                <TableHead className="hidden w-48 sm:table-cell">{columns.meta}</TableHead>
                <TableHead className="w-14 md:w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ item, row }) => (
                <TableRow key={item.id} className={cn("hover:bg-tint", editing?.id === item.id && "bg-tint")}>
                  <TableCell className="py-1 align-middle">
                    <button
                      type="button"
                      data-tip="Edit"
                      onClick={() => open(item)}
                      className="block min-h-11 w-full truncate rounded text-left font-medium text-foreground underline decoration-transparent underline-offset-4 transition-colors hover:decoration-foreground/40 md:min-h-7"
                    >
                      {row.title}
                    </button>
                    {row.meta && <span className="-mt-2 block truncate pb-1 text-caption text-muted-foreground sm:hidden">{row.meta}</span>}
                  </TableCell>
                  <TableCell className="hidden truncate align-middle text-muted-foreground md:table-cell">{stripHtml(row.text)}</TableCell>
                  {hasStatus && (
                    <TableCell className="align-middle">
                      {row.status && (
                        <Badge status={row.status.mark} variant="secondary">
                          {sentence(row.status.word)}
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="hidden truncate align-middle text-muted-foreground sm:table-cell">{row.meta}</TableCell>
                  <TableCell className="p-0 text-right align-middle">
                    <RowMenu title={row.title} link={row.link} onEdit={() => open(item)} onDelete={() => setDoomed(item)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}

      <AlertDialog open={doomed !== null} onOpenChange={(next) => !next && setDoomed(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{doomed ? view(doomed).title : ""}”?</AlertDialogTitle>
            <AlertDialogDescription>The {noun} is removed for good. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => {
                if (doomed) void onDelete(doomed)
                setDoomed(null)
              }}
            >
              <X strokeWidth={1.5} aria-hidden />
              Delete {noun}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
