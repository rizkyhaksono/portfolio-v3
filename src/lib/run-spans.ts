/**
 * Row spans for a table column whose equal neighbours share one cell: the first row of each run gets the run's
 * length, the rows under it 0 (render no cell). Only adjacent rows merge, so the order of the table is kept.
 */
export function runSpans<T>(rows: readonly T[], key: (row: T) => string): number[] {
  const spans = rows.map(() => 0)
  let start = 0
  rows.forEach((row, i) => {
    if (i > 0 && key(row) === key(rows[start])) spans[start] += 1
    else {
      start = i
      spans[i] = 1
    }
  })
  return spans
}
