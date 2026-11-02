import { socials } from "@/data/site";
import type { Video } from "@/types";
import Hl from "./Hl";

/** YouTube thumbnail card. With a `youtubeId` it uses that video's thumbnail and link; otherwise a photo and the channel. */
export default function VideoCard({ video }: { video: Video }) {
  const id = video.youtubeId;
  const href = id ? `https://www.youtube.com/watch?v=${id}` : socials[0].href;
  const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : `/photos/${video.thumb}.jpg`;
  return (
    <a href={href} target="_blank" rel="noreferrer" data-view className="group block">
      <div className="relative aspect-video overflow-hidden bg-g200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt={video.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute inset-0 grid place-items-center bg-ink/10 transition-colors group-hover:bg-ink/25">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-paper/90 text-lg text-ink shadow-lg transition-transform group-hover:scale-110">
            <span className="ml-0.5 text-accent-d">▶</span>
          </span>
        </span>
      </div>
      <h3 className="mt-3 text-[15px] font-bold leading-snug text-ink"><Hl>{video.title}</Hl></h3>
      <p className="label mt-1 text-g500">{video.group}</p>
    </a>
  );
}
