import { photoSrc } from "@/lib/media";
import type { Media } from "@/types";

/** The extra photos and the short video (uploaded file and/or YouTube) of an item, on its own page. Renders nothing when there are none. */
export default function MediaBlock({ media, title }: { media: Media; title: string }) {
  const photos = (media.photos ?? []).filter(Boolean);
  if (!photos.length && !media.video && !media.youtubeId) return null;
  return (
    <div className="grid gap-6">
      {photos.length > 0 && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src + i} src={photoSrc(src)} alt={`${title} ${i + 1}`} loading="lazy" className="w-full break-inside-avoid rounded-xl bg-g200 object-cover" />
          ))}
        </div>
      )}
      {media.video && <video src={`/api/media/${media.video}`} controls playsInline preload="metadata" className="max-h-[78svh] w-full rounded-2xl bg-g200" />}
      {media.youtubeId && (
        <div className="aspect-video overflow-hidden rounded-2xl bg-g200">
          <iframe src={`https://www.youtube-nocookie.com/embed/${media.youtubeId}`} title={title} allowFullScreen className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
