import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.fullName} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card shown when any page is shared (WhatsApp, Facebook, LinkedIn, ...) and has no photo of its own. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#4d4f53", color: "#f7f7f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: 4, color: "#c6c6c6" }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#f7b500" }} />
          PORTFOLIO — {site.location.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase" }}>{site.fullName}</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#f7b500" }}>{site.tagline}</div>
        </div>
        <div style={{ height: 8, width: 220, background: "#f7b500", borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
