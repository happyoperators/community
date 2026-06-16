import type { Metadata } from "next";
import { getProjects, getCategories } from "@/lib/data";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse the full directory of community projects, ranked by GitHub signals.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Projects"
        subtitle="Every project in the directory, ranked by stars and recent activity. Search, filter, and sort."
      />
      <ProjectsExplorer projects={projects} categories={categories} />
    </div>
  );
}
