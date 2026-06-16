import Link from "next/link";
import { AppWindow, ArrowRight, GitPullRequest, Star, Users } from "lucide-react";
import { getProjects, getBuilders, getApps } from "@/lib/data";
import { site } from "@/lib/site";
import { ProjectCard } from "@/components/project-card";
import { BuilderCard } from "@/components/builder-card";
import { AppCard } from "@/components/app-card";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  const projects = getProjects();
  const builders = getBuilders();
  const apps = getApps();
  const topProjects = projects.slice(0, 6);
  const topApps = apps.slice(0, 4);
  const topBuilders = builders.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand)_0%,transparent_70%)] opacity-[0.08]"
        />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
            </span>
            Built by the community, for the community
          </div>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            The projects, apps, and people building with AI.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground sm:text-lg">
            A community-curated directory of what we&apos;re building — not just
            open source. No gatekeepers; anyone can add an entry with a pull
            request.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/projects" className={buttonVariants({ size: "lg" })}>
              Explore projects <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/submit"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Submit yours
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Star className="size-4" /> {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </span>
            {apps.length > 0 ? (
              <span className="inline-flex items-center gap-2">
                <AppWindow className="size-4" /> {apps.length}{" "}
                {apps.length === 1 ? "app" : "apps"}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Users className="size-4" /> {builders.length}{" "}
              {builders.length === 1 ? "builder" : "builders"}
            </span>
            <span className="inline-flex items-center gap-2">
              <GitPullRequest className="size-4" /> PR to contribute
            </span>
          </div>
        </div>
      </section>

      {/* Top projects */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHeader
          title="Top projects"
          subtitle="Ranked by stars and recent activity."
          href="/projects"
          cta="All projects"
        />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {topProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Apps */}
      {topApps.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 pb-2 sm:px-6">
          <SectionHeader
            title="Apps"
            subtitle="Things the community ships — open source or not."
            href="/apps"
            cta="All apps"
          />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topApps.map((a) => (
              <AppCard key={a.slug} app={a} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Top builders */}
      <section className="mx-auto max-w-5xl px-4 py-14 pb-20 sm:px-6">
        <SectionHeader
          title="Top builders"
          subtitle="The people shipping these projects."
          href="/builders"
          cta="All builders"
        />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {topBuilders.map((b) => (
            <BuilderCard key={b.slug} builder={b} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  href,
  cta,
}: {
  title: string;
  subtitle: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        href={href}
        className={buttonVariants({ variant: "ghost", size: "sm", className: "shrink-0" })}
      >
        {cta} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
