import {
  Globe,
  Smartphone,
  Monitor,
  Terminal,
  Puzzle,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { type Platform, platformLabel } from "@/lib/platforms";
import { Badge } from "@/components/ui/badge";

const ICONS: Record<Platform, LucideIcon> = {
  web: Globe,
  ios: Smartphone,
  android: Smartphone,
  macos: Monitor,
  windows: Monitor,
  linux: Monitor,
  cli: Terminal,
  "browser-extension": Puzzle,
  api: Webhook,
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  const Icon = ICONS[platform] ?? Globe;
  return (
    <Badge variant="outline" className="gap-1 font-normal">
      <Icon className="size-3" />
      {platformLabel(platform)}
    </Badge>
  );
}
