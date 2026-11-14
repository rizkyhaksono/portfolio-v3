import sanitizeHtml from "sanitize-html"

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "code",
  "pre",
  "hr",
]

const SAFE_HREF = /^(https?:|mailto:|\/(?!\/)|#)/i

// Figures go too: Medium leads with an image and its caption, which would open every excerpt.
const UNPRINTED = /<(script|style|figure)\b[\s\S]*?<\/\1\s*>|<!--[\s\S]*?-->/gi

// The admin types "●" at the start of a paragraph for a list item.
const TYPED_BULLET = "(?:\\s|&nbsp;)*●(?:\\s|&nbsp;)*"
const BULLET_RUN = new RegExp(`(?:<p>${TYPED_BULLET}[\\s\\S]*?</p>\\s*)+`, "g")
const BULLET_ITEM = new RegExp(`<p>${TYPED_BULLET}([\\s\\S]*?)</p>\\s*`, "g")

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: { a: ["href"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  transformTags: {
    a: (tagName, attribs): sanitizeHtml.Tag => {
      const href = (attribs.href ?? "").trim()
      if (href && SAFE_HREF.test(href)) {
        return { tagName, attribs: { href } }
      }
      return { tagName, attribs: {} as sanitizeHtml.Attributes }
    },
  },
}

/** Strips figures/scripts and turns admin ● paragraphs into a `<ul>`. */
function normalizeTypedBullets(html: string): string {
  return html.replace(UNPRINTED, "").replace(BULLET_RUN, (run) => `<ul>${run.replace(BULLET_ITEM, "<li>$1</li>")}</ul>`)
}

/**
 * Re-prints the admin's rich-text HTML through a maintained sanitizer: only allowed tags survive,
 * with no attributes except a safe `href` on anchors.
 */
export function safeHtml(html: string): string {
  return sanitizeHtml(normalizeTypedBullets(html), SANITIZE_OPTIONS)
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

/** The first sentence of plain text, for a gallery card's one muted line; the whole text when it has no full stop. */
export const firstSentence = (text: string) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text
