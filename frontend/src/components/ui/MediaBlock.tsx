"use client";
import { useMemo, useState } from "react";
import { galleryOf, resized } from "@/lib/media";
import Img from "./Img";
import { parseVideo, PLATFORM_NAME } from "@/lib/video";
import type { Media } from "@/types";
import Lightbox from "./Lightbox";

/** The extra photos and the short video (uploaded file and/or YouTube) of an item, on its own page. Click a photo to see it large, with arrows to move on. */
export default function MediaBlock({ media, title }: { media: Media & { photo?: string }; title: string }) {
  const photos = galleryOf(media);
  const linked = parseVideo(media.youtubeId);
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => photos.map((p, i) => ({ src: resized(p, 1920), title: `${title}`, kicker: title && "Photo", description: undefined as string | undefined, i })), [photos, title]);
  if (!photos.length && !media.video && !media.youtubeId) return null;
  return (
    <div className="grid gap-6">
      {photos.length > 0 && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {photos.map((src, i) => (
            <button key={src + i} type="button" data-view aria-label={`View photo ${i + 1} of ${photos.length} large`} onClick={() => setOpen(i)}
              className="group block w-full break-inside-avoid overflow-hidden rounded-xl bg-g200">
              <Img name={src} alt={`${title} ${i + 1}`} sizes="(min-width:1024px) 32vw, (min-width:640px) 48vw, 100vw" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]" />
            </button>
          ))}
        </div>
      )}
      <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      {media.video && <video src={`/api/media/${media.video}`} poster={media.videoPoster ? resized(media.videoPoster, 1080) : undefined} controls playsInline preload="metadata" className="max-h-[78svh] w-full rounded-2xl bg-g200" />}
      {linked?.embed && (
        <div className="aspect-video overflow-hidden rounded-2xl bg-g200">
          <iframe src={linked.embed} title={title} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full border-0" />
        </div>
      )}
      {linked && !linked.embed && (
        <a href={linked.url} target="_blank" rel="noreferrer" data-link className="label justify-self-start rounded-full bg-accent px-5 py-3 text-ink">Watch on {PLATFORM_NAME[linked.platform]} ↗</a>
      )}
    </div>
  );
}
