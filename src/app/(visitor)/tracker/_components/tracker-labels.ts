import type { TrackerStatus } from "@/services/visitor/tracker"

// Sentence case on the page; the service keeps its own labels.
export const COLUMN_LABEL: Record<TrackerStatus, string> = { todo: "To do", in_progress: "In progress", in_qa: "In QA", done: "Done" }
export const TYPE_LABEL: Record<string, string> = { task: "Task", bug: "Bug", story: "Story" }
export const PRIORITIES = ["high", "medium", "low"]
export const EMPTY_FORM = { title: "", description: "", type: "task", priority: "medium" }
export type TrackerForm = typeof EMPTY_FORM
