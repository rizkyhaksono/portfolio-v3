"use client"

import { useEffect } from "react"
import { useEditor, EditorContent, type ChainedCommands, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Quote, Undo, Redo, Code, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  /** Accessible name of the writing area (the field label). */
  label?: string
  className?: string
}

interface Tool {
  label: string
  icon: LucideIcon
  /** The command, added to a chain that already focuses the editor. */
  run: (chain: ChainedCommands) => ChainedCommands
  /** Mark or node name for the pressed state; tools without one are plain actions. */
  active?: [string, Record<string, unknown>?]
}

const GROUPS: Tool[][] = [
  [
    { label: "Bold", icon: Bold, run: (c) => c.toggleBold(), active: ["bold"] },
    { label: "Italic", icon: Italic, run: (c) => c.toggleItalic(), active: ["italic"] },
    { label: "Inline code", icon: Code, run: (c) => c.toggleCode(), active: ["code"] },
  ],
  [
    { label: "Heading", icon: Heading2, run: (c) => c.toggleHeading({ level: 2 }), active: ["heading", { level: 2 }] },
    { label: "Subheading", icon: Heading3, run: (c) => c.toggleHeading({ level: 3 }), active: ["heading", { level: 3 }] },
  ],
  [
    { label: "Bulleted list", icon: List, run: (c) => c.toggleBulletList(), active: ["bulletList"] },
    { label: "Numbered list", icon: ListOrdered, run: (c) => c.toggleOrderedList(), active: ["orderedList"] },
    { label: "Quote", icon: Quote, run: (c) => c.toggleBlockquote(), active: ["blockquote"] },
  ],
  [
    { label: "Undo", icon: Undo, run: (c) => c.undo() },
    { label: "Redo", icon: Redo, run: (c) => c.redo() },
  ],
]

/** Inset toolbar; a pressed tool is inverted (ink ground) and says so with aria-pressed. */
function Toolbar({ editor }: Readonly<{ editor: Editor }>) {
  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1 border-b border-rule bg-tint p-1">
      {GROUPS.map((group, i) => (
        <div key={i} className="flex items-center gap-1 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-rule [&:not(:first-child)]:pl-1">
          {group.map(({ label, icon: Icon, run, active }) => {
            const pressed = active ? editor.isActive(...active) : undefined
            return (
              <button
                key={label}
                type="button"
                data-tip={label}
                aria-label={label}
                aria-pressed={pressed}
                disabled={!run(editor.can().chain().focus()).run()}
                onClick={() => run(editor.chain().focus()).run()}
                className="inline-flex size-8 items-center justify-center text-ink transition-colors hover:bg-paper active:translate-y-px disabled:opacity-40 aria-pressed:bg-ink aria-pressed:text-paper [@media(pointer:coarse)]:size-11"
              >
                <Icon className="size-4" strokeWidth={1.5} aria-hidden />
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** TipTap editor for admin forms. Load it with next/dynamic: it is ~100 KB the rest of the site never needs. */
export function RichTextEditor({ content, onChange, placeholder = "Write something…", label, className }: Readonly<RichTextEditorProps>) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), Placeholder.configure({ placeholder })],
    content,
    immediatelyRender: false,
    // The toolbar reads isActive/can, so it has to re-render as the selection moves.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[150px] px-4 py-3 focus:outline-none",
        role: "textbox",
        "aria-multiline": "true",
        ...(label ? { "aria-label": label } : {}),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  // A form reset (edit another row, clear after save) replaces the content from outside.
  useEffect(() => {
    if (editor && content !== editor.getHTML()) editor.commands.setContent(content)
  }, [content, editor])

  return (
    <div className={cn("border border-input transition-colors focus-within:border-ink", className)}>
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
