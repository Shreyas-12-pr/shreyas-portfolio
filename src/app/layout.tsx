import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shreyas P R | B.Tech Student & Aspiring Technology Professional",
    template: "%s | Shreyas P R",
  },
  description:
    "The portfolio of Shreyas P R, a B.Tech student exploring technology, building practical skills, and developing meaningful digital experiences.",
  applicationName: "Shreyas P R Portfolio",
  keywords: [
    "Shreyas P R",
    "Shreyas P R portfolio",
    "B.Tech student portfolio",
    "technology student",
  ],
  authors: [{ name: "Shreyas P R" }],
  openGraph: {
    type: "website",
    siteName: "Shreyas P R Portfolio",
    title: "Shreyas P R | Portfolio",
    description:
      "Explore the learning journey, interests, and projects of Shreyas P R.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Shreyas P R | Portfolio",
    description:
      "Explore the learning journey, interests, and projects of Shreyas P R.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
