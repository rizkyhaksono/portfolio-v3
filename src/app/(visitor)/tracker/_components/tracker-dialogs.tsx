"use client"

import type { Dispatch, FormEvent, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TrackerStatus, TrackerTask } from "@/services/visitor/tracker"
import { COLUMN_LABEL, PRIORITIES, TYPE_LABEL, type TrackerForm } from "./tracker-labels"

interface TrackerDialogsProps {
  addStatus: TrackerStatus | null
  onCloseAdd: () => void
  form: TrackerForm
  setForm: Dispatch<SetStateAction<TrackerForm>>
  saving: boolean
  onSubmitAdd: (event: FormEvent) => void
  pendingDelete: TrackerTask | null
  onCloseDelete: () => void
  onConfirmDelete: () => void
}

/** The add-card dialog and the delete confirmation: signed-in only, so loaded only for them. */
export default function TrackerDialogs({
  addStatus,
  onCloseAdd,
  form,
  setForm,
  saving,
  onSubmitAdd,
  pendingDelete,
  onCloseDelete,
  onConfirmDelete,
}: Readonly<TrackerDialogsProps>) {
  return (
    <>
      <Dialog open={addStatus !== null} onOpenChange={(open) => !open && onCloseAdd()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New card{addStatus && ` in ${COLUMN_LABEL[addStatus]}`}</DialogTitle>
          </DialogHeader>
          <form id="tracker-add" onSubmit={onSubmitAdd} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="tracker-title">What needs doing</Label>
              <Input
                id="tracker-title"
                autoFocus
                required
                value={form.title}
                maxLength={140}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tracker-description">Details, if any</Label>
              <Textarea
                id="tracker-description"
                value={form.description}
                maxLength={2000}
                rows={3}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <Label htmlFor="tracker-type">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger id="tracker-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABEL).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tracker-priority">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
                  <SelectTrigger id="tracker-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseAdd}>
              Cancel
            </Button>
            <Button type="submit" form="tracker-add" disabled={saving || !form.title.trim()}>
              {saving ? "Adding…" : "Add card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && onCloseDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will be removed from the board for everyone. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Delete card
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
