import { useCallback } from "react"
import { act, render, renderHook, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { ChoiceGroup, useToolData } from "./tool-status"

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


it("presses only the chosen option, reports a new pick, and tags each option for analytics", async () => {
  const onChange = jest.fn()
  render(
    <ChoiceGroup label="Coin" options={[{ id: "bitcoin", name: "Bitcoin" }, { id: "solana", name: "Solana" }]} value="bitcoin" onChange={onChange} event={{ name: "tool-chart", key: "coin" }} />,
  )

  const group = screen.getByRole("group", { name: "Coin" })
  expect(within(group).getByRole("button", { name: "Bitcoin" })).toHaveAttribute("aria-pressed", "true")
  const solana = within(group).getByRole("button", { name: "Solana" })
  expect(solana).toHaveAttribute("aria-pressed", "false")
  expect(solana).toHaveAttribute("data-umami-event", "tool-chart")
  expect(solana).toHaveAttribute("data-umami-event-coin", "solana")

  await userEvent.click(solana)
  expect(onChange).toHaveBeenCalledWith("solana")
})
