/**
 * Canonical public URL of the portfolio.
 *
 * Uses `NEXT_PUBLIC_SITE_URL` when provided (local or production) and falls
 * back to the live deployment so metadata, OG images, robots and sitemap all
 * agree even when the environment variable is not set.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shreyas-portfolio-fawn.vercel.app";

export const SITE_NAME = "Shreyas P R Portfolio";
