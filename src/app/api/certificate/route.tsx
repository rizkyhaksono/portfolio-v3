import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const course = searchParams.get("course") || "Development Course"
    const theme = searchParams.get("theme") || "light"

    // Parse course title
    const courseTitle = course
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    const isDark = theme === "dark"

    // Colors based on theme
    const bg = isDark ? "#09090b" : "#ffffff"
    const textMain = isDark ? "#ffffff" : "#09090b"
    const textMuted = isDark ? "#a1a1aa" : "#71717a"
    const primary = isDark ? "#10b981" : "#059669" // Emerald-ish accent

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bg,
            fontFamily: "sans-serif",
            padding: "40px",
          }}
        >
          {/* Outer Border */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `8px solid ${textMain}`,
              width: "100%",
              height: "100%",
              padding: "60px",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {/* Corner Ornaments */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                width: 40,
                height: 40,
                borderTop: `6px solid ${primary}`,
                borderLeft: `6px solid ${primary}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 40,
                height: 40,
                borderTop: `6px solid ${primary}`,
                borderRight: `6px solid ${primary}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                width: 40,
                height: 40,
                borderBottom: `6px solid ${primary}`,
                borderLeft: `6px solid ${primary}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 40,
                height: 40,
                borderBottom: `6px solid ${primary}`,
                borderRight: `6px solid ${primary}`,
              }}
            />

            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: "900",
                letterSpacing: "0.2em",
                color: textMain,
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              CERTIFICATE
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: "600",
                color: primary,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "60px",
              }}
            >
              OF COMPLETION
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: textMuted,
                marginBottom: "30px",
                textAlign: "center",
              }}
            >
              This is to certify that the student has successfully completed:
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 54,
                fontWeight: "bold",
                color: textMain,
                marginBottom: "30px",
                textAlign: "center",
                maxWidth: "85%",
                lineHeight: 1.2,
              }}
            >
              {courseTitle}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: textMuted,
                marginBottom: "80px",
                textAlign: "center",
                maxWidth: "75%",
                lineHeight: 1.5,
              }}
            >
              Demonstrating practical proficiency and understanding of the core concepts, methodologies, and technical implementations associated with the course track.
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                paddingTop: "30px",
                marginTop: "auto",
                borderTop: `2px solid ${textMuted}40`,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 28, fontWeight: "bold", color: textMain }}>Rizky Haksono</span>
                <span style={{ fontSize: 16, color: textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "6px" }}>Lead Instructor</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 22, color: textMain, fontFamily: "monospace" }}>ID: {courseTitle.replace(/\s+/g, "").toUpperCase()}-2026</span>
                <span style={{ fontSize: 18, color: primary, fontWeight: "bold", marginTop: "8px", letterSpacing: "0.1em" }}>VERIFIED ✓</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      },
    )
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
