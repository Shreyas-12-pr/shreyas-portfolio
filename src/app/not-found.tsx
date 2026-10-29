import Link from "next/link";

export default function NotFound() {
  return (
    <main className="portfolio-wrapper">
      <section className="content-section page-shell" id="not-found">
        <div className="error-state">
          <div className="section-heading">
            <div className="eyebrow-container">
              <span className="eyebrow-mark">❖</span>
              <p className="eyebrow">404</p>
            </div>
            <h2>This page wandered off.</h2>
            <p className="section-description">
              The page you are looking for does not exist or has moved. The
              portfolio itself lives at the home page.
            </p>
          </div>
          <div className="error-state-actions">
            <Link className="button button-primary" href="/">
              Back to the portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
