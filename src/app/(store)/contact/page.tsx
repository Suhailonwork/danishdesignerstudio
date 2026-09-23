import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { ContactForm } from "@/components/store/contact-form";
import { PageHero } from "@/components/store/page-hero";
import { SocialLinks } from "@/components/store/social-links";
import { getGlobalSeo, getSiteSettings } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/structured-data";

export const revalidate = 3600;

const FAQS = [
  {
    question: "How long does a made-to-measure sherwani take?",
    answer:
      "Four to six weeks for most pieces, and up to ten weeks for heavily hand-worked groom sherwanis. We confirm the exact timeline within 24 hours of your order.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. We ship worldwide by tracked courier, and parcels usually clear customs within seven to twelve working days. Import duties are payable by the recipient.",
  },
  {
    question: "Can I exchange a size?",
    answer:
      "One size exchange per order is free within India, subject to availability. Write to support@danishdesignerstudio.com within seven days of delivery to start one.",
  },
  {
    question: "Do you offer styling advice?",
    answer:
      "Our stylists are on WhatsApp seven days a week. Send your event details and we will suggest silhouettes, fabrics and colours that work for the occasion.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    title: "Contact us",
    description:
      "Talk to the Danish Designer Studio team about sizing, custom pieces, order status or wedding styling. We reply within one working day.",
    path: "/contact",
    image: (await getSiteSettings()).pageImages.contactHero,
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
          faqSchema(FAQS)!,
        ]}
      />

      <PageHero
        title="Talk to our stylists"
        eyebrow="Contact"
        description="Sizing, custom commissions, order updates or wedding-week planning — we reply within one working day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        image={settings.pageImages.contactHero}
      />

      <div className="container-lux py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-2xl">Reach us directly</h2>
              <ul className="space-y-5 text-sm">
                <li className="flex gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ash" strokeWidth={1.3} />
                  <div>
                    <p className="eyebrow mb-1">Email</p>
                    <a href={`mailto:${settings.email}`} className="hover:text-gold">
                      {settings.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-ash" strokeWidth={1.3} />
                  <div>
                    <p className="eyebrow mb-1">Phone & WhatsApp</p>
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, "")}`}
                      className="hover:text-gold"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ash" strokeWidth={1.3} />
                  <div>
                    <p className="eyebrow mb-1">Atelier</p>
                    <p className="text-ink-soft">{settings.address}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-ash" strokeWidth={1.3} />
                  <div>
                    <p className="eyebrow mb-1">Hours</p>
                    <p className="text-ink-soft">Monday to Saturday, 10am – 8pm IST</p>
                  </div>
                </li>
              </ul>

              <div className="border-t border-line pt-6">
                <p className="eyebrow mb-4">Follow</p>
                <SocialLinks links={settings.socials} className="gap-5" />
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="border border-line bg-white p-7 lg:p-9">
              <h2 className="mb-6 text-2xl">Send us a message</h2>
              <ContactForm />
            </div>

            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="mb-6 text-2xl">
                Frequently asked
              </h2>
              <dl className="divide-y divide-line border-y border-line">
                {FAQS.map((faq) => (
                  <div key={faq.question} className="py-5">
                    <dt className="text-base text-ink">{faq.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ash">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
