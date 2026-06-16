# HO Community

An open, **community-curated directory of projects and the builders behind them**.
Everything is public, there's no backend, and anyone can add an entry by opening a
pull request with a small JSON file. Projects are ranked by GitHub signals.

- **Projects** — `/projects` — open source, ranked by stars + recent activity
- **Apps** — `/apps` — things builders ship (web/mobile/desktop), open source or not
- **Builders** — `/builders` — the people shipping them

## How it works

There is no database. Each entry is a single JSON file in the repo:

```
data/
  projects/<slug>.json     # one open-source project per file
  apps/<slug>.json         # one showcased app per file (needs a link + platforms)
  builders/<slug>.json     # one builder per file
  generated/stats.json     # GitHub stats, fetched at build time (do not edit by hand)
```

The file name is the URL slug — `data/projects/ollama.json` → `/projects/ollama`.

A **project** must be open source and is ranked by GitHub stars. An **app** is any
shipped product — it just needs a `url` and `platforms`, and may optionally link a
`repo` if it happens to be open source.

At build time, [`scripts/fetch-stars.mjs`](scripts/fetch-stars.mjs) reads every
project repo and builder GitHub handle, fetches current stars / forks / activity
from the GitHub API, and writes `data/generated/stats.json`. The site is then
statically exported — no server, no runtime API calls.

### Ranking

See [`src/lib/ranking.ts`](src/lib/ranking.ts). v1 is **stars-dominant** with a
light activity bonus so an actively-maintained project edges out an equally-starred
but abandoned one:

- **Projects:** `stars + forks×1.5 + activityBonus(recent push)`
- **Builders:** total stars across their projects + GitHub followers

Time-series / trending ("stars over time") is intentionally out of scope for v1 —
see [Roadmap](#roadmap).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, **static export** — `output: "export"`)
- [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS v4
- TypeScript
- Deploys to **Netlify** (`netlify.toml`)

## Local development

```bash
npm install
npm run fetch:stats   # populate data/generated/stats.json (uses GitHub API)
npm run dev           # http://localhost:3000
```

`npm run build` runs the stats fetch automatically (via `prebuild`) and emits the
static site to `out/`.

> **GitHub rate limits:** unauthenticated requests are capped at 60/hr per IP. Set
> `GITHUB_TOKEN` (a classic token with no scopes is enough) to raise it to 5000/hr.
> In Netlify, add `GITHUB_TOKEN` as a build environment variable.

## Deploying to Netlify

1. Connect the repo to Netlify. The included `netlify.toml` sets:
   - build command: `npm run build`
   - publish directory: `out`
2. Add a `GITHUB_TOKEN` environment variable (recommended).
3. To keep star counts fresh, either enable the scheduled GitHub Action
   (`.github/workflows/refresh-stars.yml`, which commits updated stats daily and
   triggers a redeploy) or set up a Netlify scheduled build.

## Contributing

Add your project or yourself — see [CONTRIBUTING.md](CONTRIBUTING.md). It takes one
JSON file and a pull request.

## Roadmap

- Star history snapshots (track growth/velocity over time → "trending")
- Tag pages and richer filtering
- OG image generation per entry
- Builder ↔ project verification (prove you own the GitHub account)
