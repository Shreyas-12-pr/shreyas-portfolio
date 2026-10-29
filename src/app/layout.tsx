import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shreyas P R | B.Tech Student & Aspiring Technology Professional",
    template: "%s | Shreyas P R",
  },
  description:
    "The portfolio of Shreyas P R, a B.Tech student exploring technology, building practical skills, and developing meaningful digital experiences.",
  applicationName: SITE_NAME,
  authors: [{ name: "Shreyas P R" }],
  keywords: [
    "Shreyas P R",
    "Shreyas P R portfolio",
    "B.Tech student portfolio",
    "technology student",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Shreyas P R | Portfolio",
    description:
      "Explore the learning journey, interests, and projects of Shreyas P R.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: "Shreyas P R | Portfolio",
    description:
      "Explore the learning journey, interests, and projects of Shreyas P R.",
    images: [`${SITE_URL}/opengraph-image`],
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
      <body>
        <a href="#home" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
