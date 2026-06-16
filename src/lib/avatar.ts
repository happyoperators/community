import type { Builder } from "./types";

/**
 * Resolve a builder's display avatar (explicit > GitHub > none).
 * Pure helper — safe to import from client components (no fs).
 */
export function builderAvatar(b: Builder): string | null {
  return b.avatar ?? b.userStats?.avatarUrl ?? null;
}
