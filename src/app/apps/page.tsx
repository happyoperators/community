import type { Metadata } from "next";
import Link from "next/link";
import { AppWindow } from "lucide-react";
import { getApps, getAppPlatforms } from "@/lib/data";
import { AppsExplorer } from "@/components/apps-explorer";
import { PageHeader } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Apps",
  description:
    "Apps built by the community — web, mobile, and desktop. Open source or not.",
};

export default function AppsPage() {
  const apps = getApps();
  const platforms = getAppPlatforms();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Apps"
        subtitle="Apps the community ships — web, mobile, desktop, and more. Unlike projects, apps don't have to be open source."
      />

      {apps.length > 0 ? (
        <AppsExplorer apps={apps} platforms={platforms} />
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <AppWindow className="size-8 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No apps yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Be the first to showcase an app you've built. It takes one JSON file
            and a pull request.
          </p>
          <Link href="/submit" className={buttonVariants({ className: "mt-5" })}>
            Showcase an app
          </Link>
        </div>
      )}
    </div>
  );
}
