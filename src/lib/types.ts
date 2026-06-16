// Shared data model for the community directory.
// Entries live as one JSON file per record under /data, contributed via PRs.

/** A single project in the directory. Authored by the community in data/projects/<slug>.json */
export interface ProjectInput {
  /** Display name */
  name: string;
  /** One-line description */
  description: string;
  /** GitHub repository as "owner/name" — drives the ranking signals */
  repo?: string;
  /** Project homepage / live URL */
  website?: string;
  /** Primary category, e.g. "AI", "Developer Tools" */
  category?: string;
  /** Freeform tags for filtering */
  tags?: string[];
  /** Slugs of builders behind this project (refs data/builders/<slug>.json) */
  builders?: string[];
  /** Hand-pick onto the homepage regardless of rank */
  featured?: boolean;
}

/** GitHub stats fetched at build time and merged into projects. */
export interface RepoStats {
  stars: number;
  forks: number;
  /** ISO timestamp of last push */
  pushedAt: string | null;
  /** Primary language */
  language: string | null;
  openIssues: number;
}

/** A project after the build-time merge: input + stats + derived rank score. */
export interface Project extends ProjectInput {
  slug: string;
  stats: RepoStats | null;
  /** Composite ranking score (higher = better). */
  score: number;
}

/** A person in the builders directory. data/builders/<slug>.json */
export interface BuilderInput {
  /** Full name */
  name: string;
  /** Short headline, e.g. "Building AI tools for operators" */
  tagline?: string;
  /** Longer bio */
  bio?: string;
  /** GitHub username — used for avatar + follower count */
  github?: string;
  /** X / Twitter handle (without @) */
  x?: string;
  /** Personal website */
  website?: string;
  /** Location */
  location?: string;
  /** Explicit avatar URL (defaults to the GitHub avatar) */
  avatar?: string;
  /** Skills / interest tags */
  tags?: string[];
}

/** GitHub user stats fetched at build time. */
export interface UserStats {
  followers: number;
  avatarUrl: string | null;
}

/** A builder after the build-time merge. */
export interface Builder extends BuilderInput {
  slug: string;
  userStats: UserStats | null;
  /** Slugs of this builder's projects (derived from project.builders). */
  projects: string[];
  /** Composite ranking score. */
  score: number;
}
