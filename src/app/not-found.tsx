import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] px-6 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="about-narrative" style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 400, letterSpacing: "-0.04em" }}>
        This page wandered off.
      </h1>
      <p className="about-narrative" style={{ maxWidth: 520, margin: "16px auto 0", color: "var(--muted)" }}>
        The page you are looking for does not exist or has moved. The portfolio
        itself lives at the home page.
      </p>
      <Link className="button button-primary" style={{ marginTop: 28 }} href="/">
        Back to the portfolio
      </Link>
    </main>
  );
}
