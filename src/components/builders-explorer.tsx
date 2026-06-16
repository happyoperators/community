"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Builder } from "@/lib/types";
import { BuilderCard } from "@/components/builder-card";
import { Input } from "@/components/ui/input";

export function BuildersExplorer({ builders }: { builders: Builder[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return builders;
    return builders.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.tagline ?? "").toLowerCase().includes(q) ||
        (b.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [builders, query]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search builders…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((b) => (
            <BuilderCard key={b.slug} builder={b} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No builders match. Try a different search.
        </p>
      )}
    </div>
  );
}
