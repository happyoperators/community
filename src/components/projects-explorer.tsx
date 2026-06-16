"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Sort = "rank" | "stars" | "active" | "name";

const SORTS: { value: Sort; label: string }[] = [
  { value: "rank", label: "Top ranked" },
  { value: "stars", label: "Most stars" },
  { value: "active", label: "Recently active" },
  { value: "name", label: "Name A–Z" },
];

export function ProjectsExplorer({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("rank");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "stars":
          return (b.stats?.stars ?? 0) - (a.stats?.stars ?? 0);
        case "active":
          return (
            new Date(b.stats?.pushedAt ?? 0).getTime() -
            new Date(a.stats?.pushedAt ?? 0).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.score - a.score;
      }
    });
    return list;
  }, [projects, query, category, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort((v as Sort) ?? "rank")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline" className="font-normal tabular-nums">
          {filtered.length}
        </Badge>
        <span>project{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              rank={sort === "rank" ? i + 1 : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No projects match. Try a different search.
        </p>
      )}
    </div>
  );
}
