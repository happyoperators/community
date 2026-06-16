import { Star, GitFork } from "lucide-react";
import { compact } from "@/lib/format";

/** Inline stars / forks stat chips for project cards and pages. */
export function StarStat({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      {compact(value)}
    </span>
  );
}

export function ForkStat({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      <GitFork className="size-3.5" />
      {compact(value)}
    </span>
  );
}
