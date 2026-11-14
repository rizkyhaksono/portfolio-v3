import { GroupLabelSkeleton, PageLoading } from "@/components/ui/page-loading"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ROWS = ["w-3/4", "w-1/2", "w-5/6", "w-2/3", "w-3/5", "w-4/5", "w-1/2", "w-2/3"]

/** Shown while the certificates load: the head, then the newest year's table with the real column names. */
export default function Loading() {
  return (
    <PageLoading label="Loading the certificates…" title="Certificates" description>
      <GroupLabelSkeleton />
      <Table className="min-w-[40rem] table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-48">Issuer</TableHead>
            <TableHead className="w-24">Issued</TableHead>
            <TableHead className="w-32">Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((width, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex h-5 items-center">
                  <Skeleton className={`h-3.5 ${width}`} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex h-5 items-center">
                  <Skeleton className="h-3.5 w-3/4" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex h-5 items-center">
                  <Skeleton className="h-3.5 w-14" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex h-5 items-center">
                  <Skeleton className="h-3.5 w-12" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageLoading>
  )
}
