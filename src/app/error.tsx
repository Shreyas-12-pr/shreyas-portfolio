"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-6 py-24 text-center">
      <p className="eyebrow">Something broke</p>
      <h1 className="about-narrative" style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 400, letterSpacing: "-0.04em" }}>
        This page hit an unexpected error.
      </h1>
      <p className="about-narrative" style={{ maxWidth: 520, margin: "16px auto 0", color: "var(--muted)" }}>
        The issue has been logged. You can try returning to the portfolio.
      </p>
      <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => reset()}
          className="button button-primary"
          style={{ border: "none" }}
        >
          Try again
        </button>
        <Link href="/" className="button button-secondary">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
