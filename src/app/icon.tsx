import { ImageResponse } from "next/og";

// Image generation metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Generated icon using inline CSS flexbox and basic geometric shapes
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#2563eb", // Tailwind's blue-600
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20%", // Clean smooth squirkle shape
          position: "relative",
        }}
      >
        {/* White Medical Cross */}
        <div
          style={{
            position: "absolute",
            background: "white",
            width: "6px",
            height: "18px",
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            background: "white",
            width: "18px",
            height: "6px",
            borderRadius: "2px",
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}