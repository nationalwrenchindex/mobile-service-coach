import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00B4D8",
          borderRadius: "50%",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 152,
            fontWeight: 800,
            letterSpacing: "-4px",
            fontFamily: "sans-serif",
          }}
        >
          MSC
        </span>
      </div>
    ),
    { ...size }
  );
}
