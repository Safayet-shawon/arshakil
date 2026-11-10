/**
 * Any video link the admin pastes (YouTube, Facebook, Instagram, TikTok, or just a YouTube id) turned into what the site needs:
 * the platform (for its logo), a thumbnail when the platform gives one, the page to open, and an address that can play inside the site.
 */
export type Platform = "youtube" | "facebook" | "instagram" | "tiktok" | "other";

export interface ParsedVideo {
  platform: Platform;
  /** The cleaned-up link to open on the platform itself. */
  url: string;
  /** Plays inside the page. Missing for links that cannot be embedded. */
  embed?: string;
  /** A picture of the video, when the platform lets us have one (YouTube). */
  thumb?: string;
}

export const PLATFORM_NAME: Record<Platform, string> = { youtube: "YouTube", facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", other: "Video" };

const YT_ID = /^[\w-]{11}$/;

const youtube = (id: string): ParsedVideo => ({
  platform: "youtube",
  url: `https://www.youtube.com/watch?v=${id}`,
  embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
  thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
});

/** Returns null for an empty value. Accepts a full link, a link without https://, or a bare YouTube id. */
export function parseVideo(input?: string | null): ParsedVideo | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  if (YT_ID.test(raw)) return youtube(raw);

  let u: URL;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); } catch { return null; }
  const host = u.hostname.replace(/^(www|m|web|mbasic|mobile)\./, "").toLowerCase();
  const path = u.pathname;

  // YouTube: watch?v=, youtu.be/, /shorts/, /embed/, /live/
  if (host === "youtu.be" || host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const id = host === "youtu.be" ? path.split("/")[1]
      : u.searchParams.get("v") ?? path.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/)?.[1];
    if (id && YT_ID.test(id)) return youtube(id);
    return { platform: "youtube", url: u.toString() };
  }

  // Facebook: videos, reels, watch, fb.watch short links. Public videos play through Facebook's own player.
  if (host === "fb.watch" || host.endsWith("facebook.com") || host === "fb.com") {
    const url = u.toString();
    return { platform: "facebook", url, embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=734` };
  }

  // Instagram: /p/CODE, /reel/CODE, /tv/CODE
  if (host.endsWith("instagram.com")) {
    const m = path.match(/^\/(p|reel|reels|tv)\/([\w-]+)/);
    if (m) return { platform: "instagram", url: u.toString(), embed: `https://www.instagram.com/${m[1] === "reels" ? "reel" : m[1]}/${m[2]}/embed` };
    return { platform: "instagram", url: u.toString() };
  }

  // TikTok: /@name/video/ID
  if (host.endsWith("tiktok.com")) {
    const id = path.match(/\/video\/(\d+)/)?.[1];
    return { platform: "tiktok", url: u.toString(), ...(id && { embed: `https://www.tiktok.com/embed/v2/${id}` }) };
  }

  return { platform: "other", url: u.toString() };
}

/** The video of a list item: its link, or the older YouTube id field. */
export const videoOf = (v: { url?: string; youtubeId?: string }) => parseVideo(v.url || v.youtubeId);
