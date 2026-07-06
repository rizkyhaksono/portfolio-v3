"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Plus, Lock, Trash2, Bug, BookmarkCheck, CircleDot, ChevronUp, ChevronDown, Equal, Loader2 } from "lucide-react"
import {
  TRACKER_COLUMNS,
  type TrackerStatus,
  type TrackerTask,
  createTrackerTaskClient,
  updateTrackerTaskClient,
  deleteTrackerTaskClient,
} from "@/services/visitor/tracker"

const TYPE_META: Record<string, { icon: typeof Bug; className: string }> = {
  task: { icon: BookmarkCheck, className: "text-sky-500" },
  bug: { icon: Bug, className: "text-red-500" },
  story: { icon: CircleDot, className: "text-green-500" },
}
const PRIORITY_META: Record<string, { icon: typeof ChevronUp; className: string }> = {
  high: { icon: ChevronUp, className: "text-red-500" },
  medium: { icon: Equal, className: "text-amber-500" },
  low: { icon: ChevronDown, className: "text-blue-500" },
}

function TaskCard({ task, canDelete, onDelete }: { task: TrackerTask; canDelete: boolean; onDelete: (t: TrackerTask) => void }) {
  const TypeIcon = (TYPE_META[task.type] ?? TYPE_META.task).icon
  const typeClass = (TYPE_META[task.type] ?? TYPE_META.task).className
  const PriIcon = (PRIORITY_META[task.priority] ?? PRIORITY_META.medium).icon
  const priClass = (PRIORITY_META[task.priority] ?? PRIORITY_META.medium).className

  return (
    <div className="group rounded-lg border border-border/60 bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <p className="mb-2 text-sm leading-snug">{task.title}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TypeIcon className={cn("h-4 w-4", typeClass)} />
          <span className="font-mono">{task.key}</span>
          <PriIcon className={cn("h-4 w-4", priClass)} />
        </div>
        <div className="flex items-center gap-1.5">
          {canDelete && (
            <button
              onClick={() => onDelete(task)}
              className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              aria-label="Delete card"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.createdByAvatar ?? undefined} alt={task.createdByName ?? ""} referrerPolicy="no-referrer" />
            <AvatarFallback className="text-[10px]">{(task.createdByName ?? "?").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

interface Props {
  initialTasks: TrackerTask[]
  currentUserId: string | null
  isAdmin: boolean
}

export default function TrackerBoard({ initialTasks, currentUserId, isAdmin }: Props) {
  const [tasks, setTasks] = useState<TrackerTask[]>(initialTasks)
  const [addOpen, setAddOpen] = useState(false)
  const [addStatus, setAddStatus] = useState<TrackerStatus>("todo")
  const [form, setForm] = useState({ title: "", description: "", type: "task", priority: "medium" })
  const [saving, setSaving] = useState(false)

  const canEdit = !!currentUserId
  const ownsTask = (t: TrackerTask) => !!currentUserId && (t.createdById === currentUserId || isAdmin)
  const column = (status: TrackerStatus) => tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order)

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Guard: only the card's owner (or admin) may move it — the server enforces this too.
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

    const snapshot = tasks
    setTasks((prev) => prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus, order: newOrder } : t)))
    updateTrackerTaskClient(draggableId, { status: newStatus, order: newOrder }).catch((err) => {
      setTasks(snapshot)
      toast.error(err instanceof Error ? err.message : "Could not move card.")
    })
  }

  const openAdd = (status: TrackerStatus) => {
    setAddStatus(status)
    setForm({ title: "", description: "", type: "task", priority: "medium" })
    setAddOpen(true)
  }

  const submitAdd = async () => {
    if (!form.title.trim()) return
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
      setAddOpen(false)
      toast.success("Card added")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add card.")
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (task: TrackerTask) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    const snapshot = tasks
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
    try {
      await deleteTrackerTaskClient(task.id)
      toast.success("Card deleted")
    } catch (err) {
      setTasks(snapshot)
      toast.error(err instanceof Error ? err.message : "Could not delete card.")
    }
  }

  return (
    <>
      {!canEdit && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Lock className="h-4 w-4" /> Read-only — sign in to add &amp; move cards.
          </span>
          <Button asChild size="sm" variant="outline">
            <Link href="/auth">Sign in</Link>
          </Button>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {TRACKER_COLUMNS.map((col) => {
            const items = column(col.id)
            return (
              <div key={col.id} className="flex flex-col rounded-xl bg-muted/40 p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <Eyebrow>{col.label}</Eyebrow>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{items.length}</span>
                </div>

                <Droppable droppableId={col.id} isDropDisabled={!canEdit}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex min-h-[80px] flex-1 flex-col gap-2 rounded-lg p-1 transition-colors",
                        snapshot.isDraggingOver && "bg-primary/5",
                      )}
                    >
                      {items.map((task, index) => {
                        const owns = ownsTask(task)
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!owns}>
                            {(dp, ds) => (
                              <div
                                ref={dp.innerRef}
                                {...dp.draggableProps}
                                {...dp.dragHandleProps}
                                className={cn(ds.isDragging && "rotate-1", owns ? "cursor-grab active:cursor-grabbing" : "cursor-default")}
                              >
                                <TaskCard task={task} canDelete={owns} onDelete={onDelete} />
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {canEdit && (
                  <button
                    onClick={() => openAdd(col.id)}
                    className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add card
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </DragDropContext>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New card</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              autoFocus
              placeholder="What needs doing?"
              value={form.title}
              maxLength={140}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description (optional)"
              value={form.description}
              maxLength={2000}
              rows={3}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={submitAdd} disabled={saving || !form.title.trim()} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Add card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
