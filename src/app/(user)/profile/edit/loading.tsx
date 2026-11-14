import { SectionIcon } from "@/components/layout/section-icons"
import { PageLoading } from "@/components/ui/page-loading"
import { Skeleton } from "@/components/ui/skeleton"

/** A field's place: the label, then the 36px box with its hairline. */
function Field({ tall }: Readonly<{ tall?: boolean }>) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3.5 w-20" />
      <div className={tall ? "h-32 rounded-md border border-border" : "h-9 rounded-md border border-border"} />
    </div>
  )
}

/** Shown while the form's profile loads (without it the profile page's skeleton stood in): the head, the cover, the fields. */
export default function Loading() {
  return (
    <PageLoading label="Loading your profile…" icon={<SectionIcon href="/profile" />} title="Edit your profile">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="mb-1.5 h-3 w-24" />
          <Skeleton className="aspect-[3/1] w-full rounded-lg" />
          <Skeleton className="h-8 w-32 [@media(pointer:coarse)]:h-11" />
        </div>
        <Field />
        <Field />
        <Field />
        <Field />
        <Field tall />
      </div>
    </PageLoading>
  )
}
