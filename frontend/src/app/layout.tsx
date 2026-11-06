import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import HideOnAdmin from "@/components/layout/HideOnAdmin";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import ChatBot from "@/components/chat/ChatBot";
import CommissionPill from "@/components/layout/CommissionPill";
import SiteProvider from "@/components/layout/SiteProvider";
import { cookies } from "next/headers";
import { site } from "@/data/site";
import Analytics from "@/components/layout/Analytics";
import { SITE_URL, abs } from "@/lib/seo";
import { isAdmin } from "@/lib/server/auth";
import { getContent } from "@/lib/server/content";

const DESCRIPTION = `${site.fullName}: architect, architectural photographer, traveller, author, content creator and social worker in ${site.location}. Projects, photo albums, travel notes, books and videos.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.fullName} — Architect & Photographer`, template: `%s — ${site.name}` },
  description: DESCRIPTION,
  applicationName: site.fullName,
  alternates: { canonical: SITE_URL },
  openGraph: { type: "website", url: SITE_URL, siteName: site.fullName, title: site.fullName, description: DESCRIPTION, locale: "en_GB" },
  twitter: { card: "summary_large_image", title: site.fullName, description: DESCRIPTION },
  robots: { index: true, follow: true },
  // Google Search Console: set NEXT_PUBLIC_GSC_VERIFICATION to the token from "HTML tag" verification
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

/** Who and what this site is, for search engines (shown in knowledge panels and rich results). */
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "@id": `${SITE_URL}/#person`, name: site.fullName, url: SITE_URL, image: abs(site.heroImage), description: site.tagline,
      jobTitle: "Architect", address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" }, worksFor: { "@id": `${SITE_URL}/#organization` } },
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: site.firm, url: SITE_URL, founder: { "@id": `${SITE_URL}/#person` },
      address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" } },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: site.fullName, publisher: { "@id": `${SITE_URL}/#person` }, inLanguage: "en" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [content, admin] = await Promise.all([getContent(), isAdmin()]);
  const editing = admin && (await cookies()).get("ar_edit")?.value === "1";
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <SiteProvider content={content} admin={admin} editing={editing}>
        <SmoothScroll>
          <HideOnAdmin><Header /></HideOnAdmin>
          <main>{children}</main>
          <HideOnAdmin><Footer /></HideOnAdmin>
          <HideOnAdmin><CommissionPill /></HideOnAdmin>
          <HideOnAdmin><ChatBot /></HideOnAdmin>
        </SmoothScroll>
        </SiteProvider>
        <HideOnAdmin><Cursor /></HideOnAdmin>
        <Analytics />
      </body>
    </html>
  );
}
