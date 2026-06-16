import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter({ generatedAt }: { generatedAt?: string }) {
  return (
    <footer className="border-t border-border/60 py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
        <p>
          {site.name} — open & community-curated.{" "}
          <Link href="/submit" className="underline underline-offset-4 hover:text-foreground">
            Add yours
          </Link>
          .
        </p>
        <div className="flex items-center gap-4">
          {generatedAt ? (
            <span className="tabular-nums">
              Stars updated {new Date(generatedAt).toLocaleDateString()}
            </span>
          ) : null}
          <a
            href={site.repo}
            className="underline underline-offset-4 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
