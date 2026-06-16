import type { Metadata } from "next";
import { FileJson, GitPullRequest, Star } from "lucide-react";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Submit",
  description: "Add a project or builder to the directory with a pull request.",
};

const projectExample = `{
  "name": "Your Project",
  "description": "One clear sentence about what it does.",
  "repo": "owner/repository",
  "website": "https://yourproject.com",
  "category": "AI",
  "tags": ["typescript", "cli"],
  "builders": ["your-builder-slug"],
  "featured": false
}`;

const builderExample = `{
  "name": "Your Name",
  "tagline": "What you're building, in a few words.",
  "bio": "A sentence or two about you.",
  "github": "your-username",
  "x": "your-handle",
  "website": "https://you.com",
  "location": "City, Country",
  "tags": ["react", "ai"]
}`;

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Submit to the directory"
        subtitle="Everything here is public and community-curated. There's no backend and no sign-up — you add an entry by opening a pull request with a small JSON file."
      />

      <ol className="space-y-6">
        <Step
          n={1}
          icon={<GitPullRequest className="size-4" />}
          title="Fork the repository"
        >
          Fork{" "}
          <a href={site.repo} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
            the GitHub repo
          </a>{" "}
          and create a new branch for your entry.
        </Step>

        <Step n={2} icon={<FileJson className="size-4" />} title="Add a JSON file">
          <p className="mb-3">
            Drop one file into <code className="rounded bg-muted px-1.5 py-0.5 text-sm">data/projects/</code> or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">data/builders/</code>. The file
            name becomes the URL slug (e.g. <code className="rounded bg-muted px-1.5 py-0.5 text-sm">my-project.json</code> →{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/projects/my-project</code>).
          </p>
          <CodeBlock label="data/projects/your-project.json" code={projectExample} />
          <div className="h-3" />
          <CodeBlock label="data/builders/your-name.json" code={builderExample} />
        </Step>

        <Step n={3} icon={<Star className="size-4" />} title="Open the pull request">
          Open the PR. Stars, forks, and activity are fetched automatically from
          GitHub at build time — you don't add those. Once merged, your entry is
          live and ranked.
        </Step>
      </ol>

      <div className="mt-10 flex gap-3">
        <a
          href={site.repo}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Open the repo <GitPullRequest className="size-4" />
        </a>
      </div>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-medium tabular-nums">
        {n}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="flex items-center gap-2 font-semibold">
          {icon}
          {title}
        </h3>
        <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-muted/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
        {label}
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
