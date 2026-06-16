// Platform taxonomy for showcased apps. Pure / client-safe (no fs).

export const PLATFORMS = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
  cli: "CLI",
  "browser-extension": "Browser extension",
  api: "API",
} as const;

export type Platform = keyof typeof PLATFORMS;

export const PLATFORM_KEYS = Object.keys(PLATFORMS) as Platform[];

export function platformLabel(p: Platform): string {
  return PLATFORMS[p] ?? p;
}
