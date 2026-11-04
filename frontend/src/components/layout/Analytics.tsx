"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

/** Google Analytics 4. Does nothing until NEXT_PUBLIC_GA_ID (like G-XXXXXXXXXX) is set; never loads in the admin area. */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const path = usePathname();
  if (!id || path?.startsWith("/ar6061")) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}', { anonymize_ip: true });
      `}</Script>
    </>
  );
}
