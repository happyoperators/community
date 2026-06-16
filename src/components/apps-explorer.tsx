"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { App } from "@/lib/types";
import { type Platform, platformLabel } from "@/lib/platforms";
import { AppCard } from "@/components/app-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function AppsExplorer({
  apps,
  platforms,
}: {
  apps: App[];
  platforms: Platform[];
}) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      if (platform !== "all" && !a.platforms.includes(platform as Platform))
        return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [apps, query, platform]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search apps, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={platform} onValueChange={(v) => setPlatform(v ?? "all")}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {platforms.map((p) => (
              <SelectItem key={p} value={p}>
                {platformLabel(p)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline" className="font-normal tabular-nums">
          {filtered.length}
        </Badge>
        <span>app{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((a) => (
            <AppCard key={a.slug} app={a} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No apps match. Try a different search.
        </p>
      )}
    </div>
  );
}
