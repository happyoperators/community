// Build-time fetch of GitHub signals for every project repo + builder.
// Writes data/generated/stats.json which the data loader merges in at build.
//
// Runs unauthenticated (60 req/hr/IP) by default; set GITHUB_TOKEN in CI/Netlify
// for a 5000 req/hr limit. Failures for a single repo/user are non-fatal — the
// site still builds, that entry just shows no stats until the next run.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, "data", "projects");
const BUILDERS_DIR = path.join(ROOT, "data", "builders");
const OUT_DIR = path.join(ROOT, "data", "generated");
const OUT_FILE = path.join(OUT_DIR, "stats.json");

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "ho-community-build",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

function readJsonDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}

async function ghJson(url) {
  const res = await fetch(url, { headers });
  if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
    const reset = res.headers.get("x-ratelimit-reset");
    throw new Error(
      `Rate limited. Resets at ${reset ? new Date(reset * 1000).toISOString() : "unknown"}. Set GITHUB_TOKEN to raise the limit.`,
    );
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchRepo(repo) {
  const data = await ghJson(`https://api.github.com/repos/${repo}`);
  return {
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    pushedAt: data.pushed_at ?? null,
    language: data.language ?? null,
    openIssues: data.open_issues_count ?? 0,
  };
}

async function fetchUser(username) {
  const data = await ghJson(`https://api.github.com/users/${username}`);
  return {
    followers: data.followers ?? 0,
    avatarUrl: data.avatar_url ?? null,
  };
}

async function main() {
  const projects = readJsonDir(PROJECTS_DIR);
  const builders = readJsonDir(BUILDERS_DIR);

  const repoNames = [
    ...new Set(projects.map((p) => p.repo).filter(Boolean)),
  ];
  const userNames = [
    ...new Set(builders.map((b) => b.github).filter(Boolean)),
  ];

  const repos = {};
  const users = {};
  let ok = 0;
  let failed = 0;

  for (const repo of repoNames) {
    try {
      repos[repo] = await fetchRepo(repo);
      ok++;
      console.log(`  ✓ ${repo} — ${repos[repo].stars}★`);
    } catch (err) {
      failed++;
      console.warn(`  ✗ ${repo} — ${err.message}`);
    }
  }

  for (const user of userNames) {
    try {
      users[user.toLowerCase()] = await fetchUser(user);
      ok++;
      console.log(`  ✓ @${user} — ${users[user.toLowerCase()].followers} followers`);
    } catch (err) {
      failed++;
      console.warn(`  ✗ @${user} — ${err.message}`);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), repos, users },
      null,
      2,
    ) + "\n",
  );

  console.log(
    `\nWrote ${OUT_FILE} — ${ok} ok, ${failed} failed${TOKEN ? "" : " (unauthenticated; set GITHUB_TOKEN to avoid rate limits)"}.`,
  );
}

main().catch((err) => {
  console.error("\nfetch-stars failed:", err.message);
  // Don't hard-fail the build if the whole fetch dies — write an empty stats
  // file if one doesn't exist yet so the loader has something to read.
  if (!fs.existsSync(OUT_FILE)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(
      OUT_FILE,
      JSON.stringify({ generatedAt: "", repos: {}, users: {} }, null, 2) + "\n",
    );
  }
  process.exit(0);
});
