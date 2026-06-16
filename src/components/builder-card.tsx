import Link from "next/link";
import type { Builder } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { builderAvatar } from "@/lib/avatar";
import { compact } from "@/lib/format";

export function BuilderCard({ builder }: { builder: Builder }) {
  const avatar = builderAvatar(builder);
  const initials = builder.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <Link
      href={`/builders/${builder.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/40"
    >
      <Avatar className="size-12">
        {avatar ? <AvatarImage src={avatar} alt={builder.name} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold tracking-tight">{builder.name}</h3>
        {builder.tagline ? (
          <p className="truncate text-sm text-muted-foreground">{builder.tagline}</p>
        ) : null}
      </div>
      <div className="shrink-0 text-right text-xs text-muted-foreground">
        {builder.projects.length > 0 ? (
          <div className="tabular-nums">
            {builder.projects.length} project{builder.projects.length > 1 ? "s" : ""}
          </div>
        ) : null}
        {builder.userStats ? (
          <div className="tabular-nums">{compact(builder.userStats.followers)} followers</div>
        ) : null}
      </div>
    </Link>
  );
}
