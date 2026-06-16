# Contributing

This directory is community-curated. Adding a project or builder is one JSON file
and a pull request — no sign-up, no backend.

## Add a project

Create `data/projects/<slug>.json`. The `<slug>` becomes the URL
(`data/projects/my-thing.json` → `/projects/my-thing`). Use lowercase and hyphens.

```jsonc
{
  "name": "Your Project",                 // required
  "description": "One clear sentence.",   // required
  "repo": "owner/repository",             // GitHub repo — drives ranking
  "website": "https://yourproject.com",   // optional
  "category": "AI",                       // optional, e.g. AI, Developer Tools
  "tags": ["typescript", "cli"],          // optional
  "builders": ["your-builder-slug"],      // optional, refs data/builders/*.json
  "featured": false                       // leave false; maintainers curate this
}
```

Do **not** add star counts — they're fetched automatically from GitHub at build time.

## Add a builder

Create `data/builders/<slug>.json`:

```jsonc
{
  "name": "Your Name",                    // required
  "tagline": "What you're building.",     // optional, short
  "bio": "A sentence or two about you.",  // optional
  "github": "your-username",              // optional — used for avatar + followers
  "x": "your-handle",                     // optional (no @)
  "website": "https://you.com",           // optional
  "location": "City, Country",            // optional
  "tags": ["react", "ai"]                 // optional
}
```

Link a builder to their projects by adding the builder's slug to the project's
`builders` array. The builder page lists those projects automatically.

## Checklist before opening a PR

- [ ] File is valid JSON (no trailing commas — the examples above use `jsonc` only for comments).
- [ ] `repo` is the real `owner/name` (check it loads at `https://github.com/<repo>`).
- [ ] One entry per file; file name is a clean slug.
- [ ] Builder slugs referenced in `builders` actually exist in `data/builders/`.

Run it locally if you like:

```bash
npm install
npm run fetch:stats
npm run dev
```

That's it — open the PR. Once merged, your entry is live and ranked.
