import { useCallback } from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { useToolData } from "./tool-status"

it("keeps the page already shown when a reload fails", async () => {
  let fail = false
  const load = jest.fn(async () => {
    if (fail) throw new Error("down")
    return ["page one"]
  })
  const { result } = renderHook(() => useToolData(load))
  await waitFor(() => expect(result.current.status).toBe("ready"))

  fail = true
  act(() => result.current.retry())

  await waitFor(() => expect(result.current.status).toBe("error"))
  expect(result.current.data).toEqual(["page one"])
})

it("aborts the request that a newer one replaces", () => {
  const signals: AbortSignal[] = []
  const { rerender } = renderHook(
    ({ page }) =>
      useToolData(
        useCallback(
          (signal: AbortSignal) => {
            signals.push(signal)
            return new Promise<string>(() => {})
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps -- a new page means a new request
          [page],
        ),
      ),
    { initialProps: { page: 1 } },
  )

  rerender({ page: 2 })

  expect(signals[0].aborted).toBe(true)
  expect(signals[1].aborted).toBe(false)
})
