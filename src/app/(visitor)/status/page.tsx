import { redirect } from "next/navigation"

/** Legacy /status URL — system health now lives under /stats. */
export default function StatusRedirect() {
  redirect("/stats")
}
