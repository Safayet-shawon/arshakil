import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import CommissionPill from "@/components/layout/CommissionPill";
import AdminBar from "@/components/layout/AdminBar";
import SiteProvider from "@/components/layout/SiteProvider";
import { site } from "@/data/site";
import { isAdmin } from "@/lib/server/auth";
import { getContent } from "@/lib/server/content";

export const metadata: Metadata = {
  title: { default: site.fullName, template: `%s — ${site.name}` },
  description: site.tagline,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [content, admin] = await Promise.all([getContent(), isAdmin()]);
  return (
    <html lang="en">
      <body>
        <SiteProvider content={content} admin={admin}>
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
          <CommissionPill />
          <AdminBar />
        </SmoothScroll>
        </SiteProvider>
        <Cursor />
      </body>
    </html>
  );
}
