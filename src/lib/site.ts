// Central site configuration. Edit here to rebrand.

export const site = {
  name: "HO Community",
  tagline: "A community directory of the best open-source projects and the builders behind them.",
  description:
    "An open, community-curated directory of projects and builders. Ranked by GitHub signals. No gatekeepers — anyone can contribute via a pull request.",
  url: "https://ho-community.netlify.app",
  // Repo that hosts the data files — used by the "Submit" / "Edit" links.
  repo: "https://github.com/happy-operators/community",
} as const;

export const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/builders", label: "Builders" },
  { href: "/submit", label: "Submit" },
] as const;
