import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import CommissionPill from "@/components/layout/CommissionPill";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { default: site.fullName, template: `%s — ${site.name}` },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
          <CommissionPill />
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
