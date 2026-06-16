import fs from "node:fs";
import path from "node:path";
import type {
  Builder,
  BuilderInput,
  Project,
  ProjectInput,
  RepoStats,
  UserStats,
} from "./types";
import { scoreBuilder, scoreProject } from "./ranking";

// Build-time data loading. Everything here runs during `next build` (static
// export), so reading from the filesystem is safe and there is no runtime cost.

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_DIR = path.join(DATA_DIR, "projects");
const BUILDERS_DIR = path.join(DATA_DIR, "builders");
const STATS_FILE = path.join(DATA_DIR, "generated", "stats.json");

interface StatsFile {
  generatedAt: string;
  repos: Record<string, RepoStats>;
  users: Record<string, UserStats>;
}

function readStats(): StatsFile {
  try {
    return JSON.parse(fs.readFileSync(STATS_FILE, "utf8")) as StatsFile;
  } catch {
    // No stats yet (e.g. fresh clone before fetch-stats has run).
    return { generatedAt: "", repos: {}, users: {} };
  }
}

function readJsonDir<T>(dir: string): { slug: string; data: T }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      slug: f.replace(/\.json$/, ""),
      data: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as T,
    }));
}

let cache: { projects: Project[]; builders: Builder[] } | null = null;

function load() {
  if (cache) return cache;

  const stats = readStats();
  const rawProjects = readJsonDir<ProjectInput>(PROJECTS_DIR);
  const rawBuilders = readJsonDir<BuilderInput>(BUILDERS_DIR);

  const projects: Project[] = rawProjects.map(({ slug, data }) => {
    const repoStats = data.repo ? (stats.repos[data.repo] ?? null) : null;
    return {
      ...data,
      slug,
      stats: repoStats,
      score: scoreProject(data, repoStats),
    };
  });

  // Build slug -> total project stars, and project refs for each builder.
  const builderProjects = new Map<string, string[]>();
  for (const p of projects) {
    for (const b of p.builders ?? []) {
      const list = builderProjects.get(b) ?? [];
      list.push(p.slug);
      builderProjects.set(b, list);
    }
  }

  const builders: Builder[] = rawBuilders.map(({ slug, data }) => {
    const userStats = data.github
      ? (stats.users[data.github.toLowerCase()] ?? null)
      : null;
    const projectSlugs = builderProjects.get(slug) ?? [];
    const totalStars = projectSlugs.reduce((sum, ps) => {
      const proj = projects.find((p) => p.slug === ps);
      return sum + (proj?.stats?.stars ?? 0);
    }, 0);
    return {
      ...data,
      slug,
      userStats,
      projects: projectSlugs,
      score: scoreBuilder(totalStars, userStats),
    };
  });

  projects.sort((a, b) => b.score - a.score);
  builders.sort((a, b) => b.score - a.score);

  cache = { projects, builders };
  return cache;
}

export function getProjects(): Project[] {
  return load().projects;
}

export function getProject(slug: string): Project | undefined {
  return load().projects.find((p) => p.slug === slug);
}

export function getBuilders(): Builder[] {
  return load().builders;
}

export function getBuilder(slug: string): Builder | undefined {
  return load().builders.find((b) => b.slug === slug);
}

export function getCategories(): string[] {
  const set = new Set<string>();
  for (const p of getProjects()) if (p.category) set.add(p.category);
  return [...set].sort();
}

export function getStatsGeneratedAt(): string {
  return readStats().generatedAt;
}
