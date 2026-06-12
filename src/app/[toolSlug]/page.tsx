import type { Metadata } from "next";
import { notFound } from "next/navigation";

const BASE = "https://tubekit.starmap.quest";

const tools = {
  "youtube-thumbnail-downloader": {
    name: "YouTube Thumbnail Downloader",
    eyebrow: "Thumbnail utility",
    title: "Free YouTube Thumbnail Downloader",
    description:
      "Open max-res, SD, HQ, MQ, and default YouTube thumbnail image URLs from any public video ID or watch URL.",
    primaryCta: "Open thumbnail downloader",
    homeAnchor: "youtube-thumbnail-downloader",
    example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    bullets: [
      "Supports standard YouTube, youtu.be, Shorts, and embed URL formats.",
      "Shows every common thumbnail quality so creators can test fallbacks quickly.",
      "Includes a copyright reminder near the download workflow.",
    ],
    faq: [
      ["Can I save the image directly?", "TubeKit opens the public thumbnail file. Use your browser's save image action after confirming you have rights to reuse it."],
      ["Why is max resolution missing?", "Some videos never generated a maxresdefault image. Try SD or HQ when max resolution returns a placeholder."],
    ],
  },
  "youtube-metadata-inspector": {
    name: "YouTube Metadata Inspector",
    eyebrow: "Public metadata",
    title: "Free YouTube Metadata Inspector",
    description:
      "Fetch public YouTube oEmbed title, channel, author URL, and watch-link details without claiming private stats or tags.",
    primaryCta: "Inspect public metadata",
    homeAnchor: "youtube-metadata-inspector",
    example: "https://youtu.be/dQw4w9WgXcQ",
    bullets: [
      "Uses YouTube's public oEmbed endpoint for lightweight title and channel checks.",
      "Keeps live views, likes, comments, and private tags clearly out of scope.",
      "Useful for content QA, embed previews, and quick client research notes.",
    ],
    faq: [
      ["Does this show live video stats?", "No. Live public stats require the YouTube Data API, server-side key handling, and quota management."],
      ["Does this require login?", "No. TubeKit's metadata inspector uses public oEmbed data and does not store your pasted URLs."],
    ],
  },
  "youtube-embed-generator": {
    name: "YouTube Embed Code Generator",
    eyebrow: "Publishing utility",
    title: "Free YouTube Embed Code Generator",
    description:
      "Generate copy-ready YouTube iframe embed code for blogs, docs, landing pages, client previews, and content briefs.",
    primaryCta: "Generate embed code",
    homeAnchor: "youtube-embed-generator",
    example: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    bullets: [
      "Turns a normal watch URL into standard iframe markup.",
      "Pairs embed generation with thumbnail and metadata checks in one cockpit.",
      "Designed for fast creator, marketer, and editor workflows.",
    ],
    faq: [
      ["Can I use the code in WordPress or Webflow?", "Yes. Copy the iframe and paste it into an embed/custom-code block if your platform allows YouTube embeds."],
      ["Does TubeKit host the video?", "No. The iframe still streams from YouTube; TubeKit only helps generate the markup."],
    ],
  },
  "youtube-timestamp-link-generator": {
    name: "YouTube Timestamp Link Generator",
    eyebrow: "Share-link utility",
    title: "Free YouTube Timestamp Link Generator",
    description:
      "Convert timestamps like 1:23, 83, or 1m23s into a shareable YouTube URL that starts at the exact moment.",
    primaryCta: "Build timestamp links",
    homeAnchor: "youtube-timestamp-link-generator",
    example: "https://youtu.be/dQw4w9WgXcQ?t=43",
    bullets: [
      "Accepts common timestamp formats used in editing notes and content briefs.",
      "Creates clean watch URLs with the correct t= seconds parameter.",
      "Useful for feedback, chapters, tutorials, and social snippets.",
    ],
    faq: [
      ["Which timestamp formats work?", "Use seconds, mm:ss, hh:mm:ss, or compact forms such as 1m23s."],
      ["Can I use this for Shorts?", "Yes. Paste a Shorts URL and TubeKit extracts the video ID before building the timestamp URL."],
    ],
  },
  "youtube-tag-cleaner": {
    name: "YouTube Tag Cleaner",
    eyebrow: "Keyword cleanup",
    title: "Free YouTube Tag Cleaner and Hashtag Extractor",
    description:
      "Clean pasted descriptions, rough keyword lists, and hashtags into a deduplicated YouTube tag bundle.",
    primaryCta: "Clean YouTube tags",
    homeAnchor: "youtube-tag-cleaner",
    example: "youtube seo, thumbnail design, #creator, #shorts",
    bullets: [
      "Deduplicates hashtags, comma-separated keywords, and rough competitor notes.",
      "Avoids the false promise of extracting private YouTube tags from a URL.",
      "Pairs well with title, thumbnail, and metadata research workflows.",
    ],
    faq: [
      ["Does this extract private tags from a YouTube URL?", "No. YouTube does not expose true creator tags through public browser APIs."],
      ["What should I paste into it?", "Paste your own keyword brainstorm, public description text, hashtags, or campaign notes."],
    ],
  },
} as const;

type ToolSlug = keyof typeof tools;

function getTool(slug: string) {
  return tools[slug as ToolSlug];
}

export function generateStaticParams() {
  return Object.keys(tools).map((toolSlug) => ({ toolSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ toolSlug: string }> }): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = getTool(toolSlug);
  if (!tool) return {};
  const url = `${BASE}/${toolSlug}`;
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      siteName: "TubeKit",
      type: "website",
    },
  };
}

function ToolHero({ tool }: { tool: (typeof tools)[ToolSlug] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
      <a href="/" className="text-sm font-bold text-[#21e6c1] hover:text-[#7fffee]">← Back to TubeKit cockpit</a>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#21e6c1]">{tool.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.06em] text-white md:text-7xl">{tool.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{tool.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={`/#${tool.homeAnchor}`} className="rounded-full bg-[#ff0033] px-6 py-3 text-center font-black text-white shadow-[0_0_40px_rgba(255,0,51,.35)] hover:bg-[#ff335c]">{tool.primaryCta}</a>
            <a href="/#seo-tools" className="rounded-full border border-white/15 px-6 py-3 text-center font-bold text-white hover:bg-white/10">Browse all YouTube tools</a>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-6 shadow-2xl shadow-black/40">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Example input</p>
          <code className="mt-4 block break-all rounded-2xl border border-[#21e6c1]/20 bg-black/40 p-4 text-sm text-[#9fffee]">{tool.example}</code>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
            {tool.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="text-[#21e6c1]">●</span><span>{bullet}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ToolFaq({ tool }: { tool: (typeof tools)[ToolSlug] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="grid gap-5 md:grid-cols-2">
        {tool.faq.map(([question, answer]) => (
          <article key={question} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-xl font-black text-white">{question}</h2>
            <p className="mt-3 leading-7 text-slate-400">{answer}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-[2rem] border border-[#ffd166]/25 bg-[#ffd166]/10 p-6 text-[#fff3c4]">
        <h2 className="text-2xl font-black text-white">Honest YouTube coverage</h2>
        <p className="mt-3 leading-7">TubeKit focuses on public URL patterns, public oEmbed metadata, and browser-side utilities. Live video statistics and true private creator tags require the YouTube Data API and are not claimed by this page.</p>
      </div>
    </section>
  );
}

function howToJsonLd(tool: (typeof tools)[ToolSlug], url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.title,
    description: tool.description,
    url,
    step: [
      { "@type": "HowToStep", name: "Paste a YouTube URL", text: `Open TubeKit and paste an example such as ${tool.example}.` },
      { "@type": "HowToStep", name: `Run the ${tool.name}`, text: "Use the focused tool panel to generate the output in your browser." },
      { "@type": "HowToStep", name: "Copy or open the result", text: "Copy the generated URL, embed code, or cleaned text into your publishing workflow." },
    ],
  };
}

export default async function ToolLandingPage({ params }: { params: Promise<{ toolSlug: string }> }) {
  const { toolSlug } = await params;
  const tool = getTool(toolSlug);
  if (!tool) notFound();

  const url = `${BASE}/${toolSlug}`;
  const jsonLd = howToJsonLd(tool, url);
  return (
    <div className="studio-grid min-h-dvh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolHero tool={tool} />
      <ToolFaq tool={tool} />
    </div>
  );
}
