import type { Metadata } from "next";
import { ImageResponse } from "next/og";

export const metadata: Metadata = {
  title: "Shreyas P R | Portfolio",
  description:
    "Explore the learning journey, interests, and projects of Shreyas P R.",
};

export async function generateImage(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d1117",
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            color: "#e6edf3",
            fontSize: "72px",
            fontWeight: "600",
            fontFamily: "Georgia, serif",
          }}
        >
          Shreyas P R
        </div>
        <div
          style={{
            color: "#58a6ff",
            fontSize: "28px",
            fontFamily: "monospace",
          }}
        >
          student · community builder · tech enthusiast
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

export default function OpenGraphImage(): Promise<ImageResponse> {
  return generateImage();
}
