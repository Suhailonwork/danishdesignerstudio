import { JsonLd } from "@/components/seo/json-ld";
import { Footer } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
import { getCurrentUser } from "@/lib/auth";
import {
  getActiveCategories,
  getActiveCollections,
  getGlobalSeo,
  getNavigationFor,
  getSiteSettings,
} from "@/lib/data/queries";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [
    settings,
    seo,
    mainNav,
    customerNav,
    categoryNav,
    policyNav,
    categories,
    collections,
    user,
  ] = await Promise.all([
    getSiteSettings(),
    getGlobalSeo(),
    getNavigationFor("main"),
    getNavigationFor("footer_customer"),
    getNavigationFor("footer_categories"),
    getNavigationFor("footer_policies"),
    getActiveCategories(),
    getActiveCollections(),
    getCurrentUser(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[organizationSchema(settings, seo), websiteSchema(settings, seo)]} />

      <Header
        settings={settings}
        navigation={mainNav}
        categories={categories}
        collections={collections}
        user={user}
      />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer
        settings={settings}
        customerLinks={customerNav}
        categoryLinks={categoryNav}
        policyLinks={policyNav}
      />

      {/* Spacer so the fixed bottom bar never covers the end of the footer. */}
      <div aria-hidden="true" className="h-16 lg:hidden" />

      <MobileBottomNav user={user} />
      <WhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
