import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, MapPin, Pencil } from "lucide-react";
import { getBuilder, getBuilders, getProject, getApp } from "@/lib/data";
import { builderAvatar } from "@/lib/avatar";
import { GithubIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { compact } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectCard } from "@/components/project-card";
import { AppCard } from "@/components/app-card";

export function generateStaticParams() {
  return getBuilders().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const builder = getBuilder(slug);
  if (!builder) return {};
  return {
    title: builder.name,
    description: builder.tagline ?? builder.bio,
  };
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const builder = getBuilder(slug);
  if (!builder) notFound();

  const avatar = builderAvatar(builder);
  const projects = builder.projects
    .map((s) => getProject(s))
    .filter((p) => p !== undefined);
  const apps = builder.apps
    .map((s) => getApp(s))
    .filter((a) => a !== undefined);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/builders"
        className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6 -ml-2" })}
      >
        <ArrowLeft className="size-4" /> Builders
      </Link>

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Avatar className="size-20">
          {avatar ? <AvatarImage src={avatar} alt={builder.name} /> : null}
          <AvatarFallback className="text-2xl">{builder.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{builder.name}</h1>
          {builder.tagline ? (
            <p className="mt-1 text-lg text-muted-foreground">{builder.tagline}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {builder.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {builder.location}
              </span>
            ) : null}
            {builder.userStats ? (
              <span className="tabular-nums">
                {compact(builder.userStats.followers)} GitHub followers
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {builder.github ? (
          <a
            href={`https://github.com/${builder.github}`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <GithubIcon className="size-4" /> GitHub
          </a>
        ) : null}
        {builder.x ? (
          <a
            href={`https://x.com/${builder.x}`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            X / Twitter
          </a>
        ) : null}
        {builder.website ? (
          <a
            href={builder.website}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Globe className="size-4" /> Website
          </a>
        ) : null}
      </div>

      {builder.bio ? (
        <p className="mt-6 leading-relaxed text-foreground/90">{builder.bio}</p>
      ) : null}

      {builder.tags && builder.tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {builder.tags.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      ) : null}

      {projects.length > 0 ? (
        <>
          <Separator className="my-8" />
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Projects ({projects.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </>
      ) : null}

      {apps.length > 0 ? (
        <>
          <Separator className="my-8" />
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Apps ({apps.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {apps.map((a) => (
              <AppCard key={a.slug} app={a} />
            ))}
          </div>
        </>
      ) : null}

      <Separator className="my-8" />
      <a
        href={`${site.repo}/blob/main/data/builders/${builder.slug}.json`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <Pencil className="size-3.5" /> Suggest an edit to this profile
      </a>
    </div>
  );
}
