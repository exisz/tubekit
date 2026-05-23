import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";
import VercelAnalytics from "@/components/VercelAnalytics";

export const metadata: Metadata = {
  title: {
    default: "SITE_TITLE",
    template: "%s | SITE_TITLE",
  },
  description: "SITE_DESCRIPTION",
  openGraph: {
    title: "SITE_TITLE",
    description: "SITE_DESCRIPTION",
    url: "https://SUBDOMAIN.starmap.quest",
    siteName: "SITE_TITLE",
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://SUBDOMAIN.starmap.quest",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * ⚠️ MINIMAL ROOT LAYOUT — Pod must design header/footer from scratch.
 *
 * The template intentionally ships with NO header, navbar, or footer to prevent
 * visual homogenization across the 100-site empire. Each site should have its own
 * navigation pattern, brand mark, and footer treatment that fits its product.
 *
 * What's wired here (KEEP):
 *   - <html lang="en" data-theme="DAISY_THEME">  (theme placeholder for bootstrap)
 *   - Google Analytics / AdSense / Vercel Analytics (instrumentation)
 *   - <body class="min-h-dvh bg-base-100 flex flex-col">  (layout shell)
 *
 * What you need to add:
 *   - Header / nav / brand
 *   - Footer (unique per site — don't copy-paste the empire default)
 *   - Any global containers / max-widths
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="DAISY_THEME">
      <head>
        <GoogleAnalytics />
        <GoogleAdSense />
      </head>
      <body className="min-h-dvh bg-base-100 flex flex-col">
        <VercelAnalytics />
        {children}
      </body>
    </html>
  );
}
