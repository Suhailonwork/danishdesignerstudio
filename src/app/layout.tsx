import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Toaster } from "sonner";

import { StoreProvider } from "@/components/store/store-provider";
import { getGlobalSeo } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/utils";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();

  return {
    metadataBase: new URL(absoluteUrl()),
    title: { default: seo.siteTitle, template: seo.titleTemplate },
    description: seo.metaDescription,
    keywords: seo.keywords,
    applicationName: seo.organizationName,
    authors: [{ name: seo.organizationName, url: absoluteUrl() }],
    creator: seo.organizationName,
    publisher: seo.organizationName,
    formatDetection: { telephone: true, address: false, email: false },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
      googleBot: { index: seo.robotsIndex, follow: seo.robotsFollow, "max-image-preview": "large" },
    },
    alternates: { canonical: absoluteUrl() },
    openGraph: {
      type: "website",
      siteName: seo.organizationName,
      title: seo.siteTitle,
      description: seo.metaDescription,
      url: absoluteUrl(),
      locale: "en_IN",
      images: [{ url: seo.defaultOgImage, width: 1200, height: 630, alt: seo.siteTitle }],
    },
    twitter: {
      card: seo.twitterCardType,
      site: seo.twitterHandle,
      title: seo.siteTitle,
      description: seo.metaDescription,
      images: [seo.defaultOgImage],
    },
    ...(seo.googleSiteVerification
      ? { verification: { google: seo.googleSiteVerification } }
      : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#0e0e0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        <StoreProvider>{children}</StoreProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "2px",
              border: "1px solid #e4dfd8",
              background: "#ffffff",
              color: "#0e0e0f",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
