"use client"

import { useState, type FormEvent } from "react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import type { DropResult } from "@hello-pangea/dnd"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import {
  TRACKER_COLUMNS,
  type TrackerStatus,
  type TrackerTask,
  createTrackerTaskClient,
  updateTrackerTaskClient,
  deleteTrackerTaskClient,
} from "@/services/visitor/tracker"
import { COLUMN_LABEL, EMPTY_FORM, PRIORITIES, TYPE_LABEL } from "./tracker-labels"

const DndBoard = dynamic(() => import("./tracker-dnd"))
const DndList = dynamic(() => import("./tracker-dnd").then((module) => module.DndList))
const TrackerDialogs = dynamic(() => import("./tracker-dialogs"))

const LIST_CLASS = "mt-3 flex flex-col gap-3"

const cards = (count: number) => `${count} ${count === 1 ? "card" : "cards"}`

interface TaskCardProps {
  task: TrackerTask
  lifted?: boolean
  canDelete: boolean
  onDelete: (task: TrackerTask) => void
  onMove: (task: TrackerTask, status: TrackerStatus) => void
}

/** An index card: title, then the key, type and priority as one sentence. */
function TaskCard({ task, lifted, canDelete, onDelete, onMove }: Readonly<TaskCardProps>) {
  const author = task.createdByName ?? "Someone"
  const priority = PRIORITIES.includes(task.priority) ? task.priority : "medium"

  return (
    <article className={cn("group border bg-paper p-3", lifted ? "border-ink shadow-[3px_3px_0_hsl(var(--ink))]" : "border-rule")}>
      <h3 className="font-display text-h4 text-ink">{task.title}</h3>
      <p className="mt-1 text-small text-ink-soft">
        <code>{task.key}</code>. {TYPE_LABEL[task.type] ?? "Task"}, {priority} priority.
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 text-small text-ink-soft">
          <Avatar className="size-6">
            <AvatarImage src={task.createdByAvatar ?? undefined} alt="" referrerPolicy="no-referrer" />
            <AvatarFallback className="text-xs">{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{author}</span>
        </span>
        {canDelete && (
          // Phones stack the columns, so a long drag is replaced by a menu there.
          <Select value="" onValueChange={(status) => onMove(task, status as TrackerStatus)}>
            <SelectTrigger aria-label={`Move card ${task.key} to`} className="ml-auto w-auto shrink-0 text-small sm:hidden">
              <SelectValue placeholder="Move to" />
            </SelectTrigger>
            <SelectContent>
              {TRACKER_COLUMNS.filter(({ id }) => id !== task.status).map(({ id }) => (
                <SelectItem key={id} value={id}>
                  {COLUMN_LABEL[id]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            aria-label={`Delete card ${task.key}`}
            className="h-8 px-1 text-ink-soft [@media(hover:hover)]:opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            Delete
          </Button>
        )}
      </div>
    </article>
  )
}

interface Props {
  initialTasks: TrackerTask[]
  currentUserId: string | null
  isAdmin: boolean
}

export default function TrackerBoard({ initialTasks, currentUserId, isAdmin }: Readonly<Props>) {
  const [tasks, setTasks] = useState<TrackerTask[]>(initialTasks)
  const [addStatus, setAddStatus] = useState<TrackerStatus | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<TrackerTask | null>(null)

  const canEdit = !!currentUserId
  const ownsTask = (t: TrackerTask) => !!currentUserId && (t.createdById === currentUserId || isAdmin)
  const column = (status: TrackerStatus) => tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order)

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Only the card's owner (or admin) may move it; the server enforces this too.
    const moving = tasks.find((t) => t.id === draggableId)
    if (!moving || !ownsTask(moving)) return

    const newStatus = destination.droppableId as TrackerStatus
    const dest = column(newStatus).filter((t) => t.id !== draggableId)
    const before = dest[destination.index - 1]
    const after = dest[destination.index]
    let newOrder: number
    if (!before && !after) newOrder = 1000
    else if (!before) newOrder = after.order - 1
    else if (!after) newOrder = before.order + 1
    else newOrder = (before.order + after.order) / 2

    move(moving, newStatus, newOrder)
  }

  const move = (task: TrackerTask, status: TrackerStatus, order: number) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status, order } : t)))
    updateTrackerTaskClient(task.id, { status, order })
      .then(() => track("tracker-card-move", { from: task.status, to: status }))
      .catch(() => {
        // Put back only this card, so a later move that succeeded is not undone with it.
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status, order: task.order } : t)))
        toast.error("The card could not be moved. Try again.")
      })
  }

  // The menu puts the card at the foot of its new column.
  const moveToEnd = (task: TrackerTask, status: TrackerStatus) => move(task, status, Math.max(0, ...column(status).map((t) => t.order)) + 1)

  const openAdd = (status: TrackerStatus) => {
    setForm(EMPTY_FORM)
    setAddStatus(status)
  }

  const submitAdd = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !addStatus) return
    setSaving(true)
    try {
      const created = await createTrackerTaskClient({
        title: form.title,
        description: form.description || undefined,
        status: addStatus,
        type: form.type,
        priority: form.priority,
      })
      setTasks((prev) => [created, ...prev])
      setAddStatus(null)
      toast.success("Card added.")
    } catch {
      toast.error("The card could not be added. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    const task = pendingDelete
    if (!task) return
    setPendingDelete(null)
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
    try {
      await deleteTrackerTaskClient(task.id)
      toast.success("Card deleted.")
    } catch {
      setTasks((prev) => (prev.some((t) => t.id === task.id) ? prev : [...prev, task]))
      toast.error("The card could not be deleted. Try again.")
    }
  }

  const renderCard = (task: TrackerTask, lifted = false) => (
    <TaskCard task={task} lifted={lifted} canDelete={ownsTask(task)} onDelete={setPendingDelete} onMove={moveToEnd} />
  )

  const board = (
    <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
      {TRACKER_COLUMNS.map(({ id }) => {
        const items = column(id)
        // The head rule tops the first row of columns (1, 2 or 4 wide), so those drop their own.
        return (
          <section key={id} aria-labelledby={`column-${id}`} className="border-t border-ink pt-3 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 xl:border-t-0">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`column-${id}`} className="font-display text-h4 text-ink">
                {COLUMN_LABEL[id]}
              </h2>
              <p className="text-small tabular-nums text-ink-soft">{cards(items.length)}</p>
            </div>
            {canEdit ? (
              // The empty list keeps its height: it is the drop target.
              <DndList id={id} items={items} className={cn(LIST_CLASS, "min-h-20 transition-colors")} canDrag={ownsTask} renderCard={renderCard} />
            ) : items.length > 0 ? (
              <ol role="list" className={LIST_CLASS}>
                {items.map((task) => (
                  <li key={task.id}>{renderCard(task)}</li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 font-display text-caption text-ink-soft">Nothing here yet.</p>
            )}
            {canEdit && (
              <Button variant="ghost" size="sm" onClick={() => openAdd(id)} aria-label={`Add a card to ${COLUMN_LABEL[id]}`} className="mt-3 px-0">
                Add a card
              </Button>
            )}
          </section>
        )
      })}
    </div>
  )

  return (
    <>
      {canEdit ? <DndBoard onDragEnd={onDragEnd}>{board}</DndBoard> : board}

      {canEdit && (
        <TrackerDialogs
          addStatus={addStatus}
          onCloseAdd={() => setAddStatus(null)}
          form={form}
          setForm={setForm}
          saving={saving}
          onSubmitAdd={submitAdd}
          pendingDelete={pendingDelete}
          onCloseDelete={() => setPendingDelete(null)}
          onConfirmDelete={confirmDelete}
        />
      )}
    </>
  )
}
