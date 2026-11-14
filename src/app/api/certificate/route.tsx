import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import { THEME_HEX } from "@/lib/theme-hex"
import { CARD_HEADERS, loadPrintAssets, RULE_HEX } from "../og/print-assets"

// Node, not edge: the font is a file read from disk.
export const runtime = "nodejs"

const { background, foreground, mutedForeground } = THEME_HEX.light

const ISSUED = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Asia/Jakarta" })

/** "mcp-fundamentals" -> "MCP fundamentals". Sentence case; the one acronym among the course ids keeps its capitals. */
function courseTitle(id: string) {
  const words = id.replace(/[-_]+/g, " ").trim() || "development course"
  return (words.charAt(0).toUpperCase() + words.slice(1)).replace(/\bmcp\b/gi, "MCP")
}

// Always the light theme; the old `theme` parameter is accepted and ignored.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const course = courseTitle((searchParams.get("course") ?? "").slice(0, 40))
  const name = (searchParams.get("name") ?? "").trim().slice(0, 48) || "A reader"

  try {
    const { font } = await loadPrintAssets()
    const line = { display: "flex", fontSize: 26, color: mutedForeground, textAlign: "center" } as const

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            padding: 40,
            backgroundColor: background,
            color: foreground,
            fontFamily: "Plus Jakarta Sans",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 72px 36px",
              border: `1px solid ${RULE_HEX}`,
              borderRadius: 24,
            }}
          >
            <div style={{ display: "flex", marginTop: 16, fontSize: 56, lineHeight: 1.15 }}>Certificate of completion</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, fontSize: 22, color: mutedForeground }}>
              <div style={{ display: "flex", width: 12, height: 12, border: `1.5px solid ${mutedForeground}` }} />
              Self-attested
            </div>

            <div style={{ ...line, marginTop: 28 }}>This records that</div>
            <div
              style={{
                display: "flex",
                marginTop: 12,
                padding: "0 24px 10px",
                maxWidth: "90%",
                fontSize: name.length > 32 ? 36 : 52,
                lineHeight: 1.15,
                textAlign: "center",
                borderBottom: `1px solid ${foreground}`,
              }}
            >
              {name}
            </div>
            <div style={{ ...line, marginTop: 18 }}>worked through every lesson of the roadmap</div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 42, textAlign: "center" }}>{course}</div>
            <div style={{ ...line, marginTop: 18, fontSize: 20 }}>
              Marked complete by the reader on natee.my.id. No exam, and nobody checked the work.
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "auto",
                paddingTop: 18,
                fontSize: 22,
                color: mutedForeground,
                borderTop: `1px solid ${RULE_HEX}`,
              }}
            >
              <span>Rizky Haksono, who wrote the roadmap</span>
              <span>Issued {ISSUED.format(new Date())}</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
        fonts: [{ name: "Plus Jakarta Sans", data: font, style: "normal", weight: 600 }],
        headers: CARD_HEADERS,
      },
    )
  } catch (error) {
    console.error("certificate image failed", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
