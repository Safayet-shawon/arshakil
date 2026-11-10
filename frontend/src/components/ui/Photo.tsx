import { cn } from "@/lib/utils";
import Img from "./Img";

/** A picture in a card (an uploaded one or a bundled one), at the size it is shown. Put the parent in `group` for the hover zoom. */
export default function Photo({ name, alt, ratio, className, sizes, eager }: { name: string; alt: string; ratio?: string; className?: string; sizes?: string; eager?: boolean }) {
  return (
    <div className={cn("overflow-hidden bg-g200", className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      <Img name={name} alt={alt} sizes={sizes} eager={eager} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
  );
}
