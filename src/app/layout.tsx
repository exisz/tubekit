import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";
import VercelAnalytics from "@/components/VercelAnalytics";

export const metadata: Metadata = {
  title: {
    default: "TubeKit — Free YouTube Creator Toolkit",
    template: "%s | TubeKit",
  },
  description:
    "Free YouTube creator toolkit with thumbnail downloader, metadata extractor, embed generator, timestamp links, channel URL parser, and tag helpers.",
  openGraph: {
    title: "TubeKit — Free YouTube Creator Toolkit",
    description:
      "Download YouTube thumbnails, parse video IDs, generate embeds and timestamp links, inspect oEmbed metadata, and package creator research faster.",
    url: "https://tubekit.starmap.quest",
    siteName: "TubeKit",
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://tubekit.starmap.quest",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="night">
      <head>
        <GoogleAnalytics />
        <GoogleAdSense />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <VercelAnalytics />
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080b12]/82 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <a href="#top" className="group flex items-center gap-3 font-black tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ff0033] text-white shadow-[0_0_32px_rgba(255,0,51,.55)]">▶</span>
              <span className="text-xl">TubeKit</span>
            </a>
            <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a className="hover:text-white" href="#tools">Tools</a>
              <a className="hover:text-white" href="#workflow">Workflow</a>
              <a className="hover:text-white" href="#limits">API limits</a>
            </div>
            <a href="#tools" className="rounded-full border border-[#21e6c1]/40 px-4 py-2 text-sm font-bold text-[#21e6c1] hover:bg-[#21e6c1] hover:text-[#071018]">
              Open cockpit
            </a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 bg-black/30 px-5 py-10 text-sm text-slate-400">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>TubeKit is a free creator utility lab. No login required.</p>
            <a className="font-semibold text-slate-200 hover:text-white" href="https://rollersoft.com.au">rollersoft.com.au</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
