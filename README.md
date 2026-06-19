# TubeKit

Free YouTube creator toolkit for fast thumbnail, metadata, embed, timestamp, and tag-cleaning workflows.

Production: https://tubekit.starmap.quest

## What is included

- YouTube Thumbnail Downloader using public `img.youtube.com/vi/{id}/{quality}.jpg` URLs.
- YouTube Metadata Inspector using public oEmbed title/channel data.
- YouTube Embed Code Generator for copy-ready iframe snippets.
- YouTube Timestamp Link Generator for seconds, `mm:ss`, `hh:mm:ss`, and compact time formats.
- YouTube Tag Cleaner for pasted keywords, descriptions, and hashtags.
- Independent SEO landing pages for each core tool plus sitemap entries.

## Honest limits

TubeKit does not claim to expose private YouTube tags or live video statistics. True views, likes, comments, and creator tags require the YouTube Data API, quota management, and server-side key handling.

## Stack

- Next.js 16 + React 19 + TypeScript 5
- Tailwind CSS 4 + DaisyUI 5
- Static export (`output: "export"`)
- Vercel GitHub integration deploys from `main`

## Local development

```bash
pnpm install
pnpm dev
```

Cron pods must not run local production builds in this repo; Vercel is the deployment validation path.

## Data sources

- Public YouTube thumbnail URL pattern
- YouTube public oEmbed endpoint
- Client-side parsing and formatting only

## Monetization placeholders

Google AdSense is wired through `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` when present. Creator-tool affiliate placements are future work.
