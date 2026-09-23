import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import type { NavigationItem, SiteSettings } from "@/types";

import { NewsletterForm } from "./newsletter-form";
import { SocialLinks } from "./social-links";

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: NavigationItem[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="mb-5 text-[0.7rem] uppercase tracking-[0.2em] text-ink">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="text-sm text-ash transition-colors duration-300 hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({
  settings,
  customerLinks,
  categoryLinks,
  policyLinks,
}: {
  settings: SiteSettings;
  customerLinks: NavigationItem[];
  categoryLinks: NavigationItem[];
  policyLinks: NavigationItem[];
}) {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="container-lux py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
          <div className="space-y-6">
            <Link href="/" aria-label={`${settings.siteName} home`}>
              <Image
                src="/logo.svg"
                alt={settings.siteName}
                width={170}
                height={60}
                className="h-14 w-auto"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-ash">
              {settings.footerDescription}
            </p>
            <SocialLinks links={settings.socials} className="gap-5" />
          </div>

          <FooterColumn title="Customer" items={customerLinks} />
          <FooterColumn title="Categories" items={categoryLinks} />

          <div className="space-y-5">
            <h3 className="text-[0.7rem] uppercase tracking-[0.2em] text-ink">
              About {settings.siteName}
            </h3>
            <ul className="space-y-3 text-sm text-ash">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-2.5 transition-colors hover:text-ink"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {settings.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-2.5 transition-colors hover:text-ink"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{settings.address}</span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {["VISA", "Mastercard", "UPI", "RuPay", "Razorpay"].map((label) => (
                <span
                  key={label}
                  className="border border-line px-2.5 py-1.5 text-[0.6rem] font-semibold tracking-[0.12em] text-ash"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-line pt-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h3 className="font-display text-2xl">{settings.newsletterHeading}</h3>
            <p className="mt-2 max-w-md text-sm text-ash">{settings.newsletterSubtext}</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-lux flex flex-col items-center justify-between gap-4 py-6 text-xs text-ash md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {policyLinks.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
