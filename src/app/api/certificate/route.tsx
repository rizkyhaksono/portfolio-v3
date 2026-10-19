import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import { PRINT_HEX } from "@/lib/print-hex"
import { loadPrintAssets, RULE_HEX } from "../og/print-assets"

// Node, not edge: the fonts and the mark are files read from disk.
export const runtime = "nodejs"

const ISSUED = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Asia/Jakarta" })

/** "mcp-fundamentals" -> "MCP fundamentals". Sentence case; the one acronym among the course ids keeps its capitals. */
function courseTitle(id: string) {
  const words = id.replace(/[-_]+/g, " ").trim() || "development course"
  return (words.charAt(0).toUpperCase() + words.slice(1)).replace(/\bmcp\b/gi, "MCP")
}

// Always the light sheet; the old `theme` parameter is accepted and ignored.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const course = courseTitle((searchParams.get("course") ?? "").slice(0, 40))
  const name = (searchParams.get("name") ?? "").trim().slice(0, 48) || "A reader"

  try {
    const { fonts, mark } = await loadPrintAssets()
    const line = { display: "flex", fontSize: 26, color: PRINT_HEX.inkSoft, textAlign: "center" } as const

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            padding: 40,
            backgroundColor: PRINT_HEX.paper,
            color: PRINT_HEX.ink,
            fontFamily: "IBM Plex Sans",
          }}
        >
          {/* Double-rule frame: ink outside, a 3px gap, a hairline inside. */}
          <div style={{ display: "flex", flex: 1, padding: 3, border: `1px solid ${PRINT_HEX.ink}` }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 72px 36px",
                border: `1px solid ${RULE_HEX}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mark} width={117} height={104} alt="" />
              <div style={{ display: "flex", marginTop: 16, fontSize: 52, fontWeight: 600, lineHeight: 1.15, letterSpacing: -1 }}>Certificate of completion</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, fontSize: 22, color: PRINT_HEX.inkSoft }}>
                <div style={{ display: "flex", width: 12, height: 12, border: `1.5px solid ${PRINT_HEX.inkSoft}` }} />
                Self-attested
              </div>

              <div style={{ ...line, marginTop: 28 }}>This records that</div>
              <div
                style={{
                  display: "flex",
                  marginTop: 12,
                  padding: "0 24px 10px",
                  maxWidth: "90%",
                  fontSize: name.length > 32 ? 34 : 48,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  textAlign: "center",
                  borderBottom: `1px solid ${PRINT_HEX.ink}`,
                }}
              >
                {name}
              </div>
              <div style={{ ...line, marginTop: 18 }}>worked through every lesson of the roadmap</div>
              <div style={{ display: "flex", marginTop: 8, fontSize: 40, fontWeight: 600, textAlign: "center" }}>{course}</div>
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
                  color: PRINT_HEX.inkSoft,
                  borderTop: `1px solid ${RULE_HEX}`,
                }}
              >
                <span>Rizky Haksono, who wrote the roadmap</span>
                <span>Issued {ISSUED.format(new Date())}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
        fonts,
      },
    )
  } catch (error) {
    console.error("certificate image failed", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
