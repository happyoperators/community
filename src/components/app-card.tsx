import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { App } from "@/lib/types";
import { PlatformBadge } from "@/components/platform-badge";
import { StarStat } from "@/components/stat";

export function AppCard({ app }: { app: App }) {
  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group flex flex-col rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate font-semibold tracking-tight">{app.name}</h3>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {app.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {app.platforms.map((p) => (
          <PlatformBadge key={p} platform={p} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {app.price ? <span>{app.price}</span> : null}
        {app.category ? <span>{app.category}</span> : null}
        {app.stats ? <StarStat value={app.stats.stars} /> : null}
      </div>
    </Link>
  );
}
