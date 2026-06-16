import type { Metadata } from "next";
import { getBuilders } from "@/lib/data";
import { BuildersExplorer } from "@/components/builders-explorer";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Builders",
  description: "The people behind the projects — a community directory of builders.",
};

export default function BuildersPage() {
  const builders = getBuilders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Builders"
        subtitle="The people behind the projects. Ranked by the reach of what they've shipped."
      />
      <BuildersExplorer builders={builders} />
    </div>
  );
}
