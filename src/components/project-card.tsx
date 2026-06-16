import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { StarStat, ForkStat } from "@/components/stat";
import { relativeTime } from "@/lib/format";

export function ProjectCard({ project, rank }: { project: Project; rank?: number }) {
  const updated = relativeTime(project.stats?.pushedAt ?? null);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {rank ? (
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {rank}
            </span>
          ) : null}
          <h3 className="truncate font-semibold tracking-tight">{project.name}</h3>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {project.stats ? (
          <>
            <StarStat value={project.stats.stars} />
            <ForkStat value={project.stats.forks} />
            {project.stats.language ? <span>{project.stats.language}</span> : null}
            {updated ? <span>updated {updated}</span> : null}
          </>
        ) : (
          <span>No repo linked yet</span>
        )}
      </div>

      {project.category ? (
        <div className="mt-3">
          <Badge variant="secondary" className="font-normal">
            {project.category}
          </Badge>
        </div>
      ) : null}
    </Link>
  );
}
