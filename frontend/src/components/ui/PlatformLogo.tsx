import type { Platform } from "@/lib/video";

/** The logo of the platform a video lives on, as a round badge. */
export default function PlatformLogo({ platform, className = "h-14 w-14" }: { platform: Platform; className?: string }) {
  const base = `${className} drop-shadow-lg`;
  switch (platform) {
    case "youtube":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <rect x="4" y="12" width="56" height="40" rx="13" fill="#FF0000" />
          <path d="M26 22.5v19l16.5-9.5z" fill="#fff" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <circle cx="32" cy="32" r="28" fill="#1877F2" />
          <path d="M35.5 52V35.5h5.5l.9-6.4h-6.4v-4.1c0-1.9.6-3.1 3.2-3.1h3.4V16.2c-.6-.1-2.6-.3-4.9-.3-4.9 0-8.2 3-8.2 8.4v4.8H23.5v6.4H29V52z" fill="#fff" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <defs>
            <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FFB700" /><stop offset=".45" stopColor="#E1306C" /><stop offset="1" stopColor="#5851DB" />
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="52" height="52" rx="15" fill="url(#ig)" />
          <rect x="18" y="18" width="28" height="28" rx="9" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="32" cy="32" r="7" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="42" cy="22" r="2.4" fill="#fff" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <circle cx="32" cy="32" r="28" fill="#111" />
          <path d="M38 16v21.5a7.5 7.5 0 1 1-6-7.3v5a2.8 2.8 0 1 0 1.2 2.3V16h4.8c.4 3.6 2.9 6 6.5 6.3v4.7c-2.5 0-4.7-.8-6.5-2.1z" fill="#25F4EE" transform="translate(-1.2 -1)" />
          <path d="M38 16v21.5a7.5 7.5 0 1 1-6-7.3v5a2.8 2.8 0 1 0 1.2 2.3V16h4.8c.4 3.6 2.9 6 6.5 6.3v4.7c-2.5 0-4.7-.8-6.5-2.1z" fill="#FE2C55" transform="translate(1.2 1)" />
          <path d="M38 16v21.5a7.5 7.5 0 1 1-6-7.3v5a2.8 2.8 0 1 0 1.2 2.3V16h4.8c.4 3.6 2.9 6 6.5 6.3v4.7c-2.5 0-4.7-.8-6.5-2.1z" fill="#fff" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <circle cx="32" cy="32" r="28" fill="#f7b500" />
          <path d="M26 22v20l17-10z" fill="#4d4f53" />
        </svg>
      );
  }
}
