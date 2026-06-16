// Central site configuration. Edit here to rebrand.

export const site = {
  name: "HO Community",
  tagline: "Built by the community, for the community.",
  description:
    "A community-curated directory of the projects, apps, and people building with AI. Not just open source — anyone can add an entry with a pull request.",
  url: "https://ho-community.netlify.app",
  // Repo that hosts the data files — used by the "Submit" / "Edit" links.
  repo: "https://github.com/happyoperators/community",
} as const;

export const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/apps", label: "Apps" },
  { href: "/builders", label: "Builders" },
  { href: "/submit", label: "Submit" },
] as const;
