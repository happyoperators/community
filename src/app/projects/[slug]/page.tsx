import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { getProject, getProjects, getBuilder } from "@/lib/data";
import { builderAvatar } from "@/lib/avatar";
import { GithubIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { relativeTime, compact } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.description };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const builders = (project.builders ?? [])
    .map((slug) => getBuilder(slug))
    .filter((b) => b !== undefined);

  const stats = project.stats;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/projects"
        className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6 -ml-2" })}
      >
        <ArrowLeft className="size-4" /> Projects
      </Link>

      <div className="flex flex-col gap-2">
        {project.category ? (
          <Badge variant="secondary" className="w-fit font-normal">
            {project.category}
          </Badge>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-lg text-muted-foreground">{project.description}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {project.website ? (
          <a
            href={project.website}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants()}
          >
            Visit site <ExternalLink className="size-4" />
          </a>
        ) : null}
        {project.repo ? (
          <a
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            <GithubIcon className="size-4" /> {project.repo}
          </a>
        ) : null}
      </div>

      {stats ? (
        <>
          <Separator className="my-8" />
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Stars" value={compact(stats.stars)} />
            <Stat label="Forks" value={compact(stats.forks)} />
            <Stat label="Open issues" value={compact(stats.openIssues)} />
            <Stat label="Last push" value={relativeTime(stats.pushedAt) ?? "—"} />
          </dl>
        </>
      ) : null}

      {project.tags && project.tags.length > 0 ? (
        <>
          <Separator className="my-8" />
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <Badge key={t} variant="outline" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        </>
      ) : null}

      {builders.length > 0 ? (
        <>
          <Separator className="my-8" />
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">Builders</h2>
          <div className="flex flex-col gap-2">
            {builders.map((b) => {
              const avatar = builderAvatar(b);
              return (
                <Link
                  key={b.slug}
                  href={`/builders/${b.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:bg-accent/40"
                >
                  <Avatar className="size-9">
                    {avatar ? <AvatarImage src={avatar} alt={b.name} /> : null}
                    <AvatarFallback>{b.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{b.name}</div>
                    {b.tagline ? (
                      <div className="text-sm text-muted-foreground">{b.tagline}</div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : null}

      <Separator className="my-8" />
      <a
        href={`${site.repo}/blob/main/data/projects/${project.slug}.json`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <Pencil className="size-3.5" /> Suggest an edit to this entry
      </a>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
