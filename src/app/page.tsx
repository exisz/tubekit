"use client";

import { FormEvent, useMemo, useState } from "react";

type OEmbed = {
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
};

const qualities = [
  ["maxresdefault", "Max resolution"],
  ["sddefault", "SD 640×480"],
  ["hqdefault", "HQ 480×360"],
  ["mqdefault", "MQ 320×180"],
  ["default", "Default 120×90"],
] as const;

const examples = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://youtu.be/dQw4w9WgXcQ?t=43",
  "https://www.youtube.com/shorts/dQw4w9WgXcQ",
];

const toolLandingCards = [
  {
    href: "/youtube-thumbnail-downloader",
    title: "YouTube Thumbnail Downloader",
    body: "Open max-res, SD, HQ, MQ, and default thumbnail files from any public YouTube video ID.",
  },
  {
    href: "/youtube-metadata-inspector",
    title: "YouTube Metadata Inspector",
    body: "Fetch public oEmbed title, channel, author URL, and watch-link details without a login wall.",
  },
  {
    href: "/youtube-embed-generator",
    title: "YouTube Embed Code Generator",
    body: "Copy responsive-ready iframe markup for blogs, docs, landing pages, and client previews.",
  },
  {
    href: "/youtube-timestamp-link-generator",
    title: "YouTube Timestamp Link Generator",
    body: "Convert 1:23, 83, or 1m23s into a shareable YouTube URL that starts at the exact moment.",
  },
  {
    href: "/youtube-tag-cleaner",
    title: "YouTube Tag Cleaner",
    body: "Clean pasted keywords, hashtags, and competitor description notes into a deduplicated tag bundle.",
  },
] as const;

const faqs = [
  [
    "Can TubeKit show live YouTube video stats?",
    "Not yet. Live views, likes, and comments require the YouTube Data API, quota management, and a server-side key. TubeKit currently shows public oEmbed metadata instead of pretending to expose live stats.",
  ],
  [
    "Does the tag tool extract private YouTube tags from a URL?",
    "No. YouTube does not expose true creator tags through public browser APIs. The current tool is a tag cleaner for pasted descriptions, hashtags, and keyword lists.",
  ],
  [
    "Can I download any YouTube thumbnail?",
    "TubeKit opens public thumbnail image URLs. Only reuse thumbnails when you own the rights, have permission, or are using them under a valid legal exception.",
  ],
] as const;

function extractVideoId(input: string) {
  const value = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

function secondsFromTimestamp(input: string) {
  const clean = input.trim().toLowerCase();
  if (!clean) return 0;
  if (/^\d+$/.test(clean)) return Number(clean);
  const h = clean.match(/(\d+)h/)?.[1] ?? "0";
  const m = clean.match(/(\d+)m/)?.[1] ?? "0";
  const s = clean.match(/(\d+)s/)?.[1] ?? "0";
  if (h !== "0" || m !== "0" || s !== "0") return Number(h) * 3600 + Number(m) * 60 + Number(s);
  const parts = clean.split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function extractTags(text: string) {
  const hashtags = [...text.matchAll(/#[\p{L}\p{N}_-]+/gu)].map((m) => m[0]);
  const commaTags = text
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1 && item.length < 60)
    .slice(0, 40);
  return Array.from(new Set([...hashtags, ...commaTags])).slice(0, 50);
}

export default function Home() {
  const [url, setUrl] = useState(examples[0]);
  const [timestamp, setTimestamp] = useState("1:23");
  const [tagText, setTagText] = useState("youtube seo, thumbnail design, #creator, #shorts");
  const [oembed, setOembed] = useState<OEmbed | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoId = useMemo(() => extractVideoId(url), [url]);
  const seconds = useMemo(() => secondsFromTimestamp(timestamp), [timestamp]);
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
  const timestampUrl = videoId ? `${watchUrl}&t=${seconds}s` : "";
  const embedCode = videoId
    ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    : "";
  const tags = useMemo(() => extractTags(tagText), [tagText]);

  async function loadMetadata(event?: FormEvent) {
    event?.preventDefault();
    setError("");
    setOembed(null);
    if (!videoId) {
      setError("Paste a valid YouTube URL or 11-character video ID first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`);
      if (!response.ok) throw new Error(`oEmbed returned ${response.status}`);
      setOembed(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load metadata");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(value: string, label: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setError(`${label} copied to clipboard.`);
  }

  return (
    <div id="top" className="studio-grid relative overflow-hidden">
      <section className="scanline relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:pb-24 lg:pt-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#21e6c1]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff0033]" /> Creator cockpit online
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white md:text-7xl">
            YouTube utilities for creators who move fast.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Paste one YouTube URL and instantly get thumbnail downloads, video ID parsing, embed code,
            timestamp links, public metadata, and clean tag bundles — all client-side and free.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#tools" className="rounded-full bg-[#ff0033] px-6 py-3 text-center font-black text-white shadow-[0_0_40px_rgba(255,0,51,.35)] hover:bg-[#ff335c]">Start with a URL</a>
            <a href="#seo-tools" className="rounded-full border border-white/15 px-6 py-3 text-center font-bold text-white hover:bg-white/10">Browse tool pages</a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {["5 core tools", "0 login", "honest API notes"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center text-sm font-bold text-slate-200 shadow-2xl shadow-black/20">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-4 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="rounded-[1.5rem] border border-[#21e6c1]/20 bg-black/45 p-4">
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
              <span>Signal preview</span><span className="text-[#ffd166]">Live URL parser</span>
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
              {videoId ? <img className="h-full w-full object-cover" src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="YouTube thumbnail preview" /> : null}
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <p><span className="text-slate-500">Video ID:</span> <code className="text-[#21e6c1]">{videoId || "waiting-for-url"}</code></p>
              <p><span className="text-slate-500">Timestamp:</span> <code className="text-[#ffd166]">{seconds}s</code></p>
            </div>
          </div>
        </div>
      </section>

      <section id="seo-tools" className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#21e6c1]">Creator tool pages</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">Pick the exact YouTube utility you need.</h2>
          <p className="mt-4 text-slate-400">TubeKit keeps each workflow clearly named: thumbnail download, public metadata inspection, embeds, timestamp links, and tag cleaning. No fake private tag extraction, no fake live stats.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {toolLandingCards.map((tool) => (
            <a key={tool.href} href={tool.href} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:border-[#21e6c1]/60 hover:bg-white/[0.07]">
              <h3 className="text-lg font-black text-white">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{tool.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#21e6c1]">Tool deck</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">Paste once. Ship assets.</h2>
          </div>
          <p className="max-w-xl text-slate-400">No stored data, no account wall. Everything here runs in the browser except YouTube oEmbed metadata fetches.</p>
        </div>

        <form onSubmit={loadMetadata} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <label className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">YouTube URL or video ID</label>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <input value={url} onChange={(event) => setUrl(event.target.value)} className="input input-lg flex-1 border-white/10 bg-black/35 text-white placeholder:text-slate-600" placeholder="https://www.youtube.com/watch?v=..." />
            <button className="btn btn-lg border-0 bg-[#21e6c1] font-black text-[#061014] hover:bg-[#7fffee]" disabled={loading}>{loading ? "Scanning…" : "Fetch metadata"}</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => <button type="button" key={example} onClick={() => setUrl(example)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">{example}</button>)}
          </div>
          {error ? <p className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        </form>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div id="youtube-thumbnail-downloader" className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-5">
            <h3 className="text-xl font-black text-white">Thumbnail downloader</h3>
            <p className="mt-2 text-sm text-slate-400">Uses YouTube&apos;s public image URL pattern. Open the image, then save it. Max resolution is not available for every video; try HQ or SD if maxres returns a placeholder.</p>
            <p className="mt-3 rounded-2xl border border-[#ffd166]/20 bg-[#ffd166]/10 p-3 text-xs leading-5 text-[#fff3c4]">Only download and reuse thumbnails you own, have permission to use, or can lawfully reference under your local copyright rules.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {qualities.map(([quality, label]) => (
                <a key={quality} href={videoId ? `https://img.youtube.com/vi/${videoId}/${quality}.jpg` : "#"} target="_blank" className="rounded-2xl border border-white/10 bg-black/25 p-4 hover:border-[#21e6c1]/50">
                  <span className="block font-bold text-white">{label}</span>
                  <span className="mt-1 block font-mono text-xs text-[#21e6c1]">{quality}.jpg</span>
                </a>
              ))}
            </div>
          </div>

          <div id="youtube-metadata-inspector" className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-5">
            <h3 className="text-xl font-black text-white">Metadata inspector, not live stats</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="text-slate-500">Title:</span> <span className="text-slate-100">{oembed?.title ?? "Fetch metadata to load title"}</span></p>
              <p><span className="text-slate-500">Channel:</span> <a className="text-[#21e6c1]" href={oembed?.author_url} target="_blank">{oembed?.author_name ?? "—"}</a></p>
              <p><span className="text-slate-500">Watch URL:</span> <a className="break-all text-[#ffd166]" href={watchUrl} target="_blank">{watchUrl || "—"}</a></p>
            </div>
          </div>

          <div id="youtube-embed-generator" className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-white">Embed code generator</h3>
              <button type="button" onClick={() => copyText(embedCode, "Embed code")} className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-slate-200 hover:bg-white/10">Copy embed</button>
            </div>
            <textarea readOnly value={embedCode} className="textarea mt-4 min-h-36 w-full border-white/10 bg-black/35 font-mono text-xs text-slate-200" />
          </div>

          <div id="youtube-timestamp-link-generator" className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-white">Timestamp link builder</h3>
              <button type="button" onClick={() => copyText(timestampUrl, "Timestamp URL")} className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-slate-200 hover:bg-white/10">Copy link</button>
            </div>
            <div className="mt-4 flex gap-3">
              <input value={timestamp} onChange={(event) => setTimestamp(event.target.value)} className="input flex-1 border-white/10 bg-black/35 text-white" placeholder="1:23, 83, 1m23s" />
              <span className="grid min-w-20 place-items-center rounded-xl bg-white/10 font-mono text-[#ffd166]">{seconds}s</span>
            </div>
            <a className="mt-4 block break-all rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-[#21e6c1]" href={timestampUrl} target="_blank">{timestampUrl || "Add a video first"}</a>
          </div>

          <div id="youtube-tag-cleaner" className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-white">Tag cleaner & hashtag extractor</h3>
              <button type="button" onClick={() => copyText(tags.join(", "), "Tag bundle")} className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-slate-200 hover:bg-white/10">Copy tags</button>
            </div>
            <p className="mt-2 text-sm text-slate-400">Paste a competitor description, rough keyword list, or hashtags. TubeKit deduplicates it into a clean tag bundle. It does not claim to extract private YouTube tags from a URL.</p>
            <textarea value={tagText} onChange={(event) => setTagText(event.target.value)} className="textarea mt-4 min-h-28 w-full border-white/10 bg-black/35 text-white" />
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => <span key={tag} className="rounded-full bg-[#21e6c1]/10 px-3 py-1 text-sm font-semibold text-[#9fffee]">{tag}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["01", "Research", "Grab thumbnails and oEmbed metadata from public YouTube URLs."],
            ["02", "Package", "Generate embed snippets, timestamp links, and clean tag bundles."],
            ["03", "Publish", "Move assets into your title, description, landing page, or content brief."],
          ].map(([num, title, body]) => (
            <div key={num} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="font-mono text-sm text-[#ff0033]">{num}</p>
              <h3 className="mt-5 text-2xl font-black text-white">{title}</h3>
              <p className="mt-3 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-5 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#21e6c1]">FAQ</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">Honest answers before you paste a URL.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-black text-white">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="limits" className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-[2rem] border border-[#ffd166]/25 bg-[#ffd166]/10 p-6 text-[#fff3c4]">
          <h2 className="text-2xl font-black text-white">API limits and honest coverage</h2>
          <p className="mt-3 max-w-4xl leading-7">
            Current coverage: public thumbnail URLs, video ID parsing, oEmbed title/channel metadata,
            embed code, timestamp links, and pasted tag cleanup. Live views/likes/comments and true YouTube
            keyword tags require a YouTube Data API key, so they are intentionally marked as future server-side upgrades.
          </p>
        </div>
      </section>
    </div>
  );
}
