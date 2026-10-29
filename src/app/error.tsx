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
    <main className="portfolio-wrapper">
      <section className="content-section page-shell">
        <div className="error-state">
          <div className="section-heading">
            <div className="eyebrow-container">
              <span className="eyebrow-mark">❖</span>
              <p className="eyebrow">Something broke</p>
            </div>
            <h2>This page hit an unexpected error.</h2>
            <p className="section-description">
              The issue has been logged. You can try returning to the portfolio.
            </p>
          </div>
          <div className="error-state-actions">
            <button type="button" onClick={() => reset()} className="button button-primary">
              Try again
            </button>
            <Link href="/" className="button button-secondary">
              Back to the portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
