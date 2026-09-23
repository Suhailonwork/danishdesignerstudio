import type { ComponentType, SVGProps } from "react";

import {
  EtsyIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  TelegramIcon,
  TiktokIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import type { SocialLink } from "@/types";
import { cn, titleCase } from "@/lib/utils";

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: XIcon,
  x: XIcon,
  pinterest: PinterestIcon,
  linkedin: LinkedInIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
  tiktok: TiktokIcon,
  telegram: TelegramIcon,
  etsy: EtsyIcon,
};

export function SocialLinks({
  links,
  className,
  iconClassName,
}: {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
}) {
  const usable = links.filter((link) => ICONS[link.platform.toLowerCase()]);
  if (!usable.length) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-4", className)}>
      {usable.map((link) => {
        const Icon = ICONS[link.platform.toLowerCase()];
        return (
          <li key={`${link.platform}-${link.url}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-ash transition-colors duration-300 hover:text-ink"
              aria-label={`Danish Designer Studio on ${titleCase(link.platform)}`}
            >
              <Icon className={cn("h-4 w-4", iconClassName)} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
