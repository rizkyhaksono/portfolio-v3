import { ImageResponse } from "next/og";

export const runtime = "edge";

const typeLabel: Record<string, string> = {
  blog: "Blog",
  project: "Project",
  changelog: "Changelog",
  roadmap: "Roadmap",
};

const typeAccent: Record<string, string> = {
  blog: "#6366f1",
  project: "#10b981",
  changelog: "#f59e0b",
  roadmap: "#ec4899",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Rizky Haksono").slice(0, 140);
  const subtitle = (searchParams.get("subtitle") ?? "").slice(0, 180);
  const type = (searchParams.get("type") ?? "").toLowerCase();
  const label = typeLabel[type] ?? "";
  const accent = typeAccent[type] ?? "#6366f1";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0b1020",
          backgroundImage: `radial-gradient(circle at 20% 20%, ${accent}33 0%, transparent 45%), radial-gradient(circle at 80% 80%, ${accent}22 0%, transparent 50%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            R
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>Rizky Haksono</span>
            <span style={{ fontSize: 20, color: "#94a3b8" }}>AI Engineer</span>
          </div>
          {label ? (
            <div
              style={{
                marginLeft: "auto",
                padding: "10px 24px",
                borderRadius: 999,
                border: `2px solid ${accent}`,
                color: accent,
                fontSize: 22,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {label}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: title.length > 70 ? 64 : 80,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 30, color: "#cbd5e1", lineHeight: 1.4 }}>{subtitle}</div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          <span>natee.my.id</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: accent }} />
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
