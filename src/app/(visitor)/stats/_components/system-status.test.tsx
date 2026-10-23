import { fireEvent, render, screen } from "@testing-library/react"
import SystemStatus from "./system-status"
import { getHealth } from "@/services/visitor/health"

jest.mock("@/services/visitor/health", () => ({ getHealth: jest.fn() }))

const health = getHealth as jest.MockedFunction<typeof getHealth>

it("keeps the last answer on screen when a later check fails", async () => {
  health.mockResolvedValueOnce({
    overall: "operational",
    services: [
      { name: "API", status: "operational", latencyMs: 12 },
      { name: "Database", status: "operational", latencyMs: 3 },
    ],
    checkedAt: "2026-10-22T10:00:00.000Z",
  })
  render(<SystemStatus />)
  expect(await screen.findByText("All systems operational")).toBeInTheDocument()

  health.mockResolvedValueOnce(null)
  fireEvent.click(screen.getByRole("button", { name: "Check again" }))

  expect(await screen.findByText(/did not reach the API/)).toBeInTheDocument()
  expect(screen.getByText("All systems operational")).toBeInTheDocument()
  expect(screen.getByText("Database")).toBeInTheDocument()
})

it("reports the API as down when it never answered", async () => {
  health.mockResolvedValueOnce(null)
  render(<SystemStatus />)
  expect(await screen.findByText("Systems unavailable")).toBeInTheDocument()
  expect(screen.getByText("Unreachable")).toBeInTheDocument()
})
