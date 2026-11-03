import { photoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

/** A stock photo from /public/photos/<name>.jpg. Put the parent in `group` for the hover zoom. */
export default function Photo({ name, alt, ratio, className }: { name: string; alt: string; ratio?: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden bg-g200", className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoSrc(name)} alt={alt} loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
  );
}
