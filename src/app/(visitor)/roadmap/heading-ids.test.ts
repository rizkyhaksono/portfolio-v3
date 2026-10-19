import { headingIds } from "@/components/ui/roadmap-mdx-component"
import { courseTitle } from "./course-title"

type Node = Parameters<ReturnType<ReturnType<typeof headingIds>>>[0]

const heading = (depth: number, ...children: Node[]): Node => ({ type: "heading", depth, children })
const text = (value: string): Node => ({ type: "text", value })

describe("headingIds", () => {
  it("ids every heading from its full text, dedupes, and lists only top-level h2 / h3", () => {
    const tree: Node = {
      type: "root",
      children: [
        heading(2, text("Using "), { type: "inlineCode", value: "v-if" }),
        heading(2, text("Example")),
        heading(3, text("Example")),
        heading(4, text("Deep")),
        { type: "mdxJsxFlowElement", children: [heading(2, text("Inside a tab"))] },
      ],
    }
    const out: { id: string; text: string; depth: number }[] = []
    headingIds(out)()(tree)

    expect(out).toEqual([
      { id: "using-v-if", text: "Using v-if", depth: 2 },
      { id: "example", text: "Example", depth: 2 },
      { id: "example-1", text: "Example", depth: 3 },
    ])
    expect(tree.children?.[4].children?.[0].data?.hProperties?.id).toBe("inside-a-tab")
  })
})

describe("courseTitle", () => {
  it("prints course ids in sentence case", () => {
    expect(courseTitle("mcp-fundamentals")).toBe("MCP fundamentals")
    expect(courseTitle("vue-fundamentals")).toBe("Vue fundamentals")
  })
})
