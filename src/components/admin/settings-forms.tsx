"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import type { GlobalSeo, SiteSettings } from "@/types";
import type { AdminResult } from "@/actions/admin/core";
import { saveGlobalSeo, saveSiteSettings } from "@/actions/admin/settings";
import { Input, Select, Textarea } from "@/components/ui/field";
import { absoluteUrl, truncate } from "@/lib/utils";

import { ImageField } from "./image-field";
import { Card, FormFeedback, SubmitButton, Toggle } from "./ui";

function useToastResult(state: AdminResult | null) {
  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);
}

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<AdminResult | null, FormData>(saveSiteSettings, null);
  useToastResult(state);

  return (
    <form action={formAction} className="space-y-6">
      <Card title="Brand" description="Used across the header, footer and structured data.">
        <div className="grid gap-5 lg:grid-cols-2">
          <Input name="siteName" label="Site name" defaultValue={settings.siteName} />
          <Input name="tagline" label="Tagline" defaultValue={settings.tagline} />
          <div className="lg:col-span-2">
            <Textarea
              name="description"
              label="Store description"
              rows={3}
              defaultValue={settings.description}
              hint="Also used as the default meta description fallback."
            />
          </div>
          <div className="lg:col-span-2">
            <ImageField name="logoUrl" label="Logo" defaultValue={settings.logoUrl} />
          </div>
        </div>
      </Card>

      <Card title="Contact">
        <div className="grid gap-5 lg:grid-cols-2">
          <Input name="email" label="Support email" type="email" defaultValue={settings.email} />
          <Input name="phone" label="Phone" defaultValue={settings.phone} />
          <Input
            name="whatsapp"
            label="WhatsApp number"
            defaultValue={settings.whatsapp}
            hint="Digits only, including country code — e.g. 919000000000."
          />
          <Input
            name="instagramHandle"
            label="Instagram handle"
            defaultValue={settings.instagramHandle}
          />
          <div className="lg:col-span-2">
            <Textarea name="address" label="Address" rows={2} defaultValue={settings.address} />
          </div>
        </div>
      </Card>

      <Card
        title="Page imagery"
        description="Pictures used on the About and Contact pages."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <ImageField
            name="pageImages.aboutHero"
            label="About — hero background"
            defaultValue={settings.pageImages.aboutHero}
          />
          <ImageField
            name="pageImages.aboutPrimary"
            label="About — main editorial image"
            defaultValue={settings.pageImages.aboutPrimary}
          />
          <ImageField
            name="pageImages.aboutSecondary"
            label="About — secondary image"
            defaultValue={settings.pageImages.aboutSecondary}
          />
          <ImageField
            name="pageImages.contactHero"
            label="Contact — hero background"
            defaultValue={settings.pageImages.contactHero}
          />
        </div>
      </Card>

      <Card
        title="Announcement bar"
        description="Rotating messages above the header. Edit as JSON — one object per message."
      >
        <Textarea
          name="announcements"
          label="Announcements"
          rows={8}
          defaultValue={JSON.stringify(settings.announcements, null, 2)}
          className="font-mono text-xs"
          hint={'Format: [{ "text": "…", "linkText": "Shop now", "href": "/shop" }]'}
        />
      </Card>

      <Card title="Social profiles" description="Rendered in the header strip and footer.">
        <Textarea
          name="socials"
          label="Social links"
          rows={10}
          defaultValue={JSON.stringify(settings.socials, null, 2)}
          className="font-mono text-xs"
          hint={
            'Format: [{ "platform": "instagram", "url": "https://…" }]. Supported: facebook, instagram, twitter, pinterest, linkedin, youtube, whatsapp, tiktok, telegram, etsy.'
          }
        />
      </Card>

      <Card title="Footer and newsletter">
        <div className="space-y-5">
          <Textarea
            name="footerDescription"
            label="Footer description"
            rows={3}
            defaultValue={settings.footerDescription}
          />
          <Input
            name="newsletterHeading"
            label="Newsletter heading"
            defaultValue={settings.newsletterHeading}
          />
          <Textarea
            name="newsletterSubtext"
            label="Newsletter subtext"
            rows={2}
            defaultValue={settings.newsletterSubtext}
          />
        </div>
      </Card>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-ivory/95 py-4 backdrop-blur-sm">
        <SubmitButton>Save settings</SubmitButton>
        <span className="flex-1" />
        <div className="w-full sm:w-auto">
          <FormFeedback state={state} />
        </div>
      </div>
    </form>
  );
}

export function GlobalSeoForm({ seo }: { seo: GlobalSeo }) {
  const [state, formAction] = useActionState<AdminResult | null, FormData>(saveGlobalSeo, null);
  useToastResult(state);

  return (
    <form action={formAction} className="space-y-6">
      <Card
        title="Search preview"
        description="How the homepage appears in search results."
      >
        <div className="max-w-2xl space-y-1 border border-line bg-white p-4">
          <p className="truncate text-xs text-emerald-800">{absoluteUrl()}</p>
          <p className="text-lg leading-snug text-[#1a0dab]">{truncate(seo.siteTitle, 60)}</p>
          <p className="text-sm leading-relaxed text-[#4d5156]">
            {truncate(seo.metaDescription, 158)}
          </p>
        </div>
      </Card>

      <Card title="Global metadata">
        <div className="space-y-5">
          <Input name="siteTitle" label="Site title" defaultValue={seo.siteTitle} />
          <Input
            name="titleTemplate"
            label="Title template"
            defaultValue={seo.titleTemplate}
            hint="Use %s where the page title should go, e.g. %s | Danish Designer Studio."
          />
          <Textarea
            name="metaDescription"
            label="Default meta description"
            rows={3}
            defaultValue={seo.metaDescription}
          />
          <Input
            name="keywords"
            label="Keywords"
            defaultValue={seo.keywords.join(", ")}
            hint="Comma separated."
          />
        </div>
      </Card>

      <Card title="Social sharing">
        <div className="space-y-5">
          <ImageField
            name="defaultOgImage"
            label="Default share image"
            defaultValue={seo.defaultOgImage}
            hint="1200 × 630. Used wherever a page has no image of its own."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              name="twitterHandle"
              label="X / Twitter handle"
              defaultValue={seo.twitterHandle}
              placeholder="@danishdesignerstudio"
            />
            <Select name="twitterCardType" label="Card type" defaultValue={seo.twitterCardType}>
              <option value="summary_large_image">Large image</option>
              <option value="summary">Summary</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card title="Organisation">
        <div className="space-y-5">
          <Input
            name="organizationName"
            label="Organisation name"
            defaultValue={seo.organizationName}
          />
          <ImageField
            name="organizationLogo"
            label="Organisation logo"
            defaultValue={seo.organizationLogo}
          />
          <Input
            name="googleSiteVerification"
            label="Google site verification"
            defaultValue={seo.googleSiteVerification ?? ""}
            hint="Optional. The content value from Search Console's meta tag."
          />
        </div>
      </Card>

      <Card
        title="Crawling"
        description="These switches drive robots.txt and every page's robots meta tag."
      >
        <div className="flex flex-wrap gap-8">
          <Toggle
            name="robotsIndex"
            label="Allow indexing"
            description="Turning this off blocks all crawlers site-wide."
            defaultChecked={seo.robotsIndex}
          />
          <Toggle
            name="robotsFollow"
            label="Allow following links"
            defaultChecked={seo.robotsFollow}
          />
        </div>
      </Card>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-ivory/95 py-4 backdrop-blur-sm">
        <SubmitButton>Save SEO settings</SubmitButton>
        <span className="flex-1" />
        <div className="w-full sm:w-auto">
          <FormFeedback state={state} />
        </div>
      </div>
    </form>
  );
}
