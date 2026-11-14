import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { z } from "zod"
import { Collection } from "./collection"

const schema = z.object({ title: z.string().min(2) })
type Item = { id: string; title: string }

function setup() {
  render(
    <Collection<Item, z.infer<typeof schema>>
      noun="project"
      plural="projects"
      heading="Projects"
      schema={schema}
      blank={{ title: "" }}
      fields={[{ name: "title", label: "Title" }]}
      load={async () => [{ id: "a1", title: "Alpha" }]}
      save={async () => undefined}
      remove={async () => undefined}
      toValues={(item) => ({ title: item.title })}
      view={(item) => ({ title: item.title })}
    />,
  )
}

describe("Collection editor dialog", () => {
  it("opens a row in a dialog titled with the row and closes untouched without asking", async () => {
    setup()
    fireEvent.click(await screen.findByRole("button", { name: "Alpha" }))
    const dialog = await screen.findByRole("dialog", { name: "Alpha" })
    expect(dialog).toHaveTextContent("Save project")
    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(screen.queryByText("Discard your changes?")).toBeNull()
  })

  it("asks before discarding edits", async () => {
    setup()
    fireEvent.click(await screen.findByRole("button", { name: /New project/ }))
    const dialog = await screen.findByRole("dialog", { name: "New project" })
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Beta" } })
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(await screen.findByText("Discard your changes?")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Discard changes" }))
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
  })
})
