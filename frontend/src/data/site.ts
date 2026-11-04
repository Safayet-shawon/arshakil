import type { Field, NavItem, Social } from "@/types";

// All content below is placeholder. The backend (NestJS, /api/content) serves the same shape.
export const site = {
  name: "Shakil",
  /** Hero name, split in two rows. */
  heroName: [["AR.", "Shakhaouth"], ["Hossain", "Shakil"]] as const,
  fullName: "AR. Shakhaouth Hossain Shakil",
  tagline: "Architect · Architectural Photographer · Traveller · Author · Content Creator · Social Worker",
  /** Hero paragraphs. */
  introLines: [
    "Designing spaces and stories that are calm, considered, and built to last.",
    "Co-founder of Kolpo (Dhaka) and Studio Karu (Chittagong), Founder of WaQia and Roots organic (Dhaka).",
  ],
  email: "hello@example.com",
  phone: "+880 1XXX-XXXXXX",
  location: "Dhaka, Bangladesh",
  firm: "Kolpo",
  timeZone: "Asia/Dhaka",
  heroImage: "/images/hero-portrait.webp",
};

/** Words that swipe in the hero. */
export const roles = ["Architect", "Architectural Photographer", "Traveller", "Author", "Content Creator", "Social Worker"];

/** The loader list, in order. The last one is introduced with "and". */
export const introRoles = ["Architect", "Traveller", "Author", "Content Creator", "Social Worker", "Architectural Photographer"];

export const fields: Field[] = [
  { slug: "architecture", title: "Architecture", href: "/architecture", blurb: "Selected projects from Kolpo and Studio Karu." },
  { slug: "photography", title: "Architectural Photography", href: "/photography", blurb: "Buildings, people and places, one frame at a time." },
  { slug: "content-creation", title: "Content Creation", href: "/content-creation", blurb: "Videos and vlogs on YouTube, Facebook, Instagram and TikTok." },
  { slug: "travel", title: "Travel", href: "/travel", blurb: "Bangladesh and abroad: maps, stories and the history behind them." },
  { slug: "author", title: "Author", href: "/author", blurb: "Books and essays, free to read and download as PDF." },
  { slug: "social-work", title: "Social Work", href: "/social-work", blurb: "Community initiatives and giving back." },
];

export const socials: Social[] = [
  { label: "YouTube", href: "https://youtube.com/", icon: "▶", handle: "@your-channel" },
  { label: "Facebook", href: "https://facebook.com/", icon: "f", handle: "/your-page" },
  { label: "Instagram", href: "https://instagram.com/", icon: "◎", handle: "@your-handle" },
  { label: "TikTok", href: "https://tiktok.com/", icon: "♪", handle: "@your-handle" },
  { label: "LinkedIn", href: "https://linkedin.com/", icon: "in", handle: "/in/your-name" },
];

export const nav: NavItem[] = [
  { label: "Work", href: "/#work", count: "06" },
  { label: "Services", href: "/#services", count: "04" },
  { label: "Fields", href: "/#fields", count: "06", children: fields.map((f) => ({ label: f.title, href: f.href })) },
  {
    label: "Content", href: "/content-creation",
    children: [
      ...socials.slice(0, 4).map((s) => ({ label: s.label, href: s.href, external: true })),
      { label: "All videos", href: "/content-creation" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];
