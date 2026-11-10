import type { ImgHTMLAttributes } from "react";
import { resized, srcSetOf } from "@/lib/media";

/**
 * A picture of the site: shown at the size it is needed (a small card gets a small file), loaded when it comes into view.
 * `sizes` says how wide it is on screen; `eager` is for pictures at the very top of a page.
 */
export default function Img({ name, alt, sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw", eager, ...rest }: {
  name: string; alt: string; sizes?: string; eager?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "srcSet" | "sizes">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resized(name, 828)} srcSet={srcSetOf(name)} sizes={sizes} alt={alt}
      loading={eager ? "eager" : "lazy"} decoding="async" {...(eager ? { fetchPriority: "high" as const } : {})} {...rest} />
  );
}
