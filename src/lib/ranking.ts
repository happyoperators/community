import type { ProjectInput, RepoStats, UserStats } from "./types";

// --- Project ranking -------------------------------------------------------
// v1 is stars-dominant with a light "is it alive?" activity bonus so that an
// actively-maintained popular project edges out an equally-starred dead one.
// Forks add a small collaboration signal. No time-series yet (see ROADMAP).

const DAY = 1000 * 60 * 60 * 24;

function daysSince(iso: string | null): number {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / DAY;
}

/** Activity multiplier applied to stars based on recency of the last push. */
function activityBonus(stars: number, pushedAt: string | null): number {
  const d = daysSince(pushedAt);
  if (d <= 7) return stars * 0.15;
  if (d <= 30) return stars * 0.08;
  if (d <= 90) return stars * 0.03;
  return 0;
}

export function scoreProject(
  input: ProjectInput,
  stats: RepoStats | null,
): number {
  if (!stats) {
    // No repo / stats yet — keep it discoverable but below ranked projects.
    return input.featured ? 1 : 0;
  }
  const base = stats.stars + stats.forks * 1.5;
  const bonus = activityBonus(stats.stars, stats.pushedAt);
  const featuredBoost = input.featured ? 1.05 : 1;
  return Math.round((base + bonus) * featuredBoost);
}

// --- Builder ranking -------------------------------------------------------
// A builder's score is the reach of what they've shipped (total project stars)
// plus their own GitHub following as a lighter personal signal.

export function scoreBuilder(
  totalProjectStars: number,
  userStats: UserStats | null,
): number {
  const followers = userStats?.followers ?? 0;
  return Math.round(totalProjectStars + followers * 0.5);
}
