import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { getApp, getApps, getBuilder } from "@/lib/data";
import { builderAvatar } from "@/lib/avatar";
import { site } from "@/lib/site";
import { compact } from "@/lib/format";
import { GithubIcon } from "@/components/icons";
import { PlatformBadge } from "@/components/platform-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function generateStaticParams() {
  return getApps().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return {};
  return { title: app.name, description: app.description };
}

export default async function AppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();

  const builders = (app.builders ?? [])
    .map((s) => getBuilder(s))
    .filter((b) => b !== undefined);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/apps"
        className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6 -ml-2" })}
      >
        <ArrowLeft className="size-4" /> Apps
      </Link>

      <div className="flex flex-col gap-2">
        {app.category ? (
          <Badge variant="secondary" className="w-fit font-normal">
            {app.category}
          </Badge>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight">{app.name}</h1>
        <p className="text-lg text-muted-foreground">{app.description}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {app.platforms.map((p) => (
          <PlatformBadge key={p} platform={p} />
        ))}
        {app.price ? (
          <Badge variant="outline" className="font-normal">
            {app.price}
          </Badge>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={app.url}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Open app <ExternalLink className="size-4" />
        </a>
        {app.repo ? (
          <a
            href={`https://github.com/${app.repo}`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            <GithubIcon className="size-4" /> {app.repo}
            {app.stats ? ` · ${compact(app.stats.stars)}★` : ""}
          </a>
        ) : null}
      </div>

      {app.tags && app.tags.length > 0 ? (
        <>
          <Separator className="my-8" />
          <div className="flex flex-wrap gap-2">
            {app.tags.map((t) => (
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
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Built by
          </h2>
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
        href={`${site.repo}/blob/main/data/apps/${app.slug}.json`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <Pencil className="size-3.5" /> Suggest an edit to this entry
      </a>
    </div>
  );
}
