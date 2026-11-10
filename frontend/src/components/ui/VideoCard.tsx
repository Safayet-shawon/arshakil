"use client";
import { useState } from "react";
import { socials } from "@/data/site";
import { photoSrc } from "@/lib/media";
import { PLATFORM_NAME, videoOf } from "@/lib/video";
import type { Video } from "@/types";
import Hl from "./Hl";
import PlatformLogo from "./PlatformLogo";

/**
 * A video: its picture with the logo of the platform it is on (YouTube, Facebook, ...) over it.
 * Press play and it plays right here on the site; links that cannot play inside the page open on the platform.
 */
export default function VideoCard({ video }: { video: Video }) {
  const v = videoOf(video);
  const [playing, setPlaying] = useState(false);
  const platform = v?.platform ?? "youtube";
  const href = v?.url ?? socials[0].href;
  const thumb = video.thumb ? photoSrc(video.thumb) : v?.thumb;
  const canPlay = !!v?.embed;

  const face = (
    <>
      {thumb
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={thumb} alt={video.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        : <span className="absolute inset-0 bg-gradient-to-br from-g600 to-ink" />}
      <span className="absolute inset-0 grid place-items-center bg-ink/10 transition-colors group-hover:bg-ink/25">
        <span className="transition-transform duration-300 group-hover:scale-110"><PlatformLogo platform={platform} className="h-16 w-16" /></span>
      </span>
      <span className="label absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] text-g50">{PLATFORM_NAME[platform]}</span>
    </>
  );

  return (
    <div className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-g200">
        {playing && v?.embed ? (
          <iframe src={`${v.embed}${v.embed.includes("?") ? "&" : "?"}autoplay=1`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
            className="absolute inset-0 h-full w-full border-0" />
        ) : canPlay ? (
          <button type="button" data-view aria-label={`Play ${video.title}`} onClick={() => setPlaying(true)} className="absolute inset-0 block h-full w-full text-left">{face}</button>
        ) : (
          <a href={href} target="_blank" rel="noreferrer" data-view aria-label={`Open ${video.title} on ${PLATFORM_NAME[platform]}`} className="absolute inset-0 block">{face}</a>
        )}
      </div>
      <h3 className="mt-3 text-[15px] font-bold leading-snug text-ink"><Hl>{video.title}</Hl></h3>
      <p className="label mt-1 flex items-center justify-between gap-3 text-g500">
        <span>{video.group}</span>
        <a href={href} target="_blank" rel="noreferrer" data-link className="text-accent-d transition-colors hover:text-ink">Open on {PLATFORM_NAME[platform]} ↗</a>
      </p>
    </div>
  );
}
