"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useForm, type DefaultValues, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { StatusLine } from "@/components/ui/status-line"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { stripHtml } from "@/components/layout/admin/admin-format"
import { cn } from "@/lib/utils"

// TipTap only loads once a slip with a rich field opens.
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor").then((m) => m.RichTextEditor), {
  ssr: false,
  loading: () => <Skeleton className="h-[12.5rem] w-full" />,
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
  /** Right-hand column: a duration, a dateline. */
  meta?: string
  /** One or two lines under the title. Editor HTML is stripped. */
  text?: string | null
  /** A page for the row (the public page, the live project), opened in a new tab. */
  link?: { href: string; label: string } | null
  status?: { word: string; mark: "filled" | "outline" | "dashed" }
}

export interface CollectionProps<T extends { id: string }, V extends FormValues> {
  /** Singular, used in buttons and dialogs: "project", "post". */
  noun: string
  plural: string
  heading: string
  /** Where the rows live and who reads them. */
  note?: string
  schema: z.ZodType<V, z.ZodTypeDef, unknown>
  blank: V
  fields: Field<V>[]
  load: () => Promise<T[]>
  /** Create when `editing` is null, else update. */
  save: (values: V, editing: T | null) => Promise<unknown>
  remove: (item: T) => Promise<unknown>
  toValues: (item: T) => V
  view: (item: T) => RowView
  filters?: { label: string; test: (item: T) => boolean }[]
  /** Extra header actions (export, for example). */
  tools?: (items: T[]) => React.ReactNode
}

function DeleteRow({ noun, title, onConfirm }: Readonly<{ noun: string; title: string; onConfirm: () => void }>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete<span className="sr-only"> {title}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{title}”?</AlertDialogTitle>
          <AlertDialogDescription>The {noun} is removed for good. This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={onConfirm}>
              Delete {noun}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * One admin table as a ledger with a form slip: rows with Edit and Delete, a framed form above them for
 * adding or editing, static skeleton rows while loading, and a retry when the source does not answer.
 */
export function Collection<T extends { id: string }, V extends FormValues>({
  noun,
  plural,
  heading,
  note,
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
  // null: no slip; "new": adding; an item: editing it.
  const [slip, setSlip] = useState<"new" | T | null>(null)
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
  const submitting = form.formState.isSubmitting

  return (
    <section className="w-full max-w-[60rem]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-h3 text-ink">{heading}</h2>
          <p className="mt-1 font-display text-caption text-ink-soft">
            {note}
            {state === "ready" && ` ${items.length} ${items.length === 1 ? noun : plural}.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {tools?.(items)}
          <Button size="sm" onClick={() => open(null)} disabled={slip === "new"}>
            Add {noun}
          </Button>
        </div>
      </div>

      {filters && state === "ready" && (
        <div role="group" aria-label={`Filter ${plural}`} className="mt-4 flex flex-wrap gap-x-6 border-b border-rule">
          {filters.map(({ label, test }, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={filter === i}
              onClick={() => setFilter(i)}
              className="-mb-px inline-flex min-h-10 items-center gap-1.5 border-b-2 border-transparent pb-1.5 pt-2 text-[15px] font-semibold text-ink-soft transition-colors hover:text-ink aria-pressed:border-ink aria-pressed:text-ink [@media(pointer:coarse)]:min-h-11"
            >
              {label}
              <span className="font-display font-normal tabular-nums">{items.filter(test).length}</span>
            </button>
          ))}
        </div>
      )}

      {slip && (
        <Card ref={slipRef} className="mt-6 scroll-mt-[calc(var(--head-h)+1rem)] p-4 sm:p-6">
          <h3 className="font-display text-h4 text-ink">{editing ? `Edit “${view(editing).title}”` : `New ${noun}`}</h3>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid gap-5 sm:grid-cols-2">
              {fields.map(({ name, label, kind = "text", placeholder, note: hint, half }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as Path<V>}
                  render={({ field }) => (
                    <FormItem className={cn(!half && "sm:col-span-2", kind === "switch" && "flex items-center justify-between gap-4 space-y-0 border-y border-rule py-3")}>
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
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : editing ? `Save ${noun}` : `Add ${noun}`}
                </Button>
                <Button type="button" variant="outline" onClick={close}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      )}

      {state === "loading" && (
        <ul aria-busy="true" aria-label={`Loading ${plural}`} className="mt-6 divide-y divide-rule border-t border-ink">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="space-y-2 py-4">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </li>
          ))}
        </ul>
      )}

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
        (shown.length === 0 ? (
          <StatusLine kind="empty" className="mt-6 border-y border-rule py-8">
            {items.length === 0 ? `No ${plural} yet. Add the first one above.` : `No ${plural} match this filter.`}
          </StatusLine>
        ) : (
          <LedgerList className="mt-6">
            {shown.map((item) => {
              const row = view(item)
              const text = stripHtml(row.text)
              return (
                <LedgerRow key={item.id} title={row.title} meta={row.meta} className={cn(editing?.id === item.id && "bg-tint")}>
                  {row.status && (
                    <Badge variant="outline" status={row.status.mark} className="mb-1.5">
                      {row.status.word}
                    </Badge>
                  )}
                  {text && <p className="line-clamp-2">{text}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <Button variant="outline" size="sm" onClick={() => open(item)}>
                      Edit<span className="sr-only"> {row.title}</span>
                    </Button>
                    <DeleteRow noun={noun} title={row.title} onConfirm={() => { void onDelete(item) }} />
                    {row.link && (
                      <InkLink href={row.link.href} external className="ml-2 text-small">
                        {row.link.label}
                      </InkLink>
                    )}
                  </div>
                </LedgerRow>
              )
            })}
          </LedgerList>
        ))}
    </section>
  )
}
