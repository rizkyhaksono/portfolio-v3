const ALLOWED = new Set(["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "a", "h2", "h3", "h4", "blockquote", "code", "pre", "hr"])
const VOID = new Set(["br", "hr"])
const SAFE_HREF = /^(https?:|mailto:|\/(?!\/)|#)/i

// Figures go too: Medium leads with an image and its caption, which would open every excerpt.
const UNPRINTED = /<(script|style|figure)\b[\s\S]*?<\/\1\s*>|<!--[\s\S]*?-->/gi

// The admin types "●" at the start of a paragraph for a list item.
const TYPED_BULLET = "(?:\\s|&nbsp;)*●(?:\\s|&nbsp;)*"
const BULLET_RUN = new RegExp(`(?:<p>${TYPED_BULLET}[\\s\\S]*?</p>\\s*)+`, "g")
const BULLET_ITEM = new RegExp(`<p>${TYPED_BULLET}([\\s\\S]*?)</p>\\s*`, "g")

/**
 * Re-prints the admin's rich-text HTML through an allowlist: only the tags above survive, with no
 * attributes except a safe `href`, and every other `<` is escaped, so the output holds only tags printed here.
 */
export function safeHtml(html: string): string {
  return html
    .replace(UNPRINTED, "")
    .replace(/<(\/?)([a-z][a-z0-9]*)\b([^>]*)>|</gi, (match, close: string, name: string, attrs: string) => {
      if (match === "<") return "&lt;"
      const tag = name.toLowerCase()
      if (!ALLOWED.has(tag)) return ""
      if (close) return VOID.has(tag) ? "" : `</${tag}>`
      if (tag !== "a") return `<${tag}>`
      const found = /\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs)
      const href = (found?.[1] ?? found?.[2] ?? found?.[3] ?? "").trim()
      return SAFE_HREF.test(href) ? `<a href="${href.replaceAll('"', "&quot;")}">` : "<a>"
    })
    .replace(BULLET_RUN, (run) => `<ul>${run.replace(BULLET_ITEM, "<li>$1</li>")}</ul>`)
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " }

/** Plain text for excerpts and meta descriptions (React escapes it again on output). */
export const plainText = (html: string) =>
  html
    .replace(UNPRINTED, " ")
    .replace(/<[^>]*>?/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, entity: string) => ENTITIES[entity])
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^●\s*/, "")
    .replace(/([.!?:;])?\s*●\s*/g, (_, stop?: string) => `${stop ?? "."} `)
