import type { Field, NavItem, Social } from "@/types";

// All content below is placeholder. The backend (NestJS, /api/content) serves the same shape.
export const site = {
  name: "Shakil",
  /** Hero name, split in two rows: [row 1 words], [row 2 words]. */
  heroName: [["AR.", "Shakhaouth"], ["Hossain", "Shakil"]] as const,
  fullName: "AR. Shakhaouth Hossain Shakil",
  tagline: "Architect · Photographer · Traveller · Writer · Content Creator",
  intro: "Designing spaces and stories that are calm, considered and built to last. Founder of studio Kolpo, Dhaka.",
  email: "hello@example.com",
  location: "Dhaka, Bangladesh",
  firm: "Kolpo",
  timeZone: "Asia/Dhaka",
  heroImage: "/images/hero-portrait.png",
};

/** Words that swipe in the hero (and walk through the intro counter, minus the last one). */
export const roles = ["Architect", "Photographer", "Traveller", "Writer", "Content Creator"];

/** Shown on the left of the intro while the counter runs. "Photographer" is the reveal at the end. */
export const introRoles = ["Architect", "Traveller", "Writer", "Content Creator"];

export const nav: NavItem[] = [
  { label: "Work", href: "#work", count: "04" },
  { label: "Service", href: "#services", count: "04" },
  { label: "Fields", href: "#fields", count: "06" },
  { label: "Contact", href: "#contact" },
];

export const socials: Social[] = [
  { label: "YouTube", href: "https://youtube.com/", icon: "▶" },
  { label: "Instagram", href: "https://instagram.com/", icon: "◎" },
  { label: "LinkedIn", href: "https://linkedin.com/", icon: "in" },
];

export const fields: Field[] = [
  { slug: "architecture", title: "Architecture", blurb: "Solo projects and the work of studio Kolpo." },
  { slug: "photography", title: "Photography", blurb: "Buildings, people and places, one frame at a time." },
  { slug: "films", title: "Films", blurb: "Moving image as another way to draw." },
  { slug: "travel", title: "Travel", blurb: "Cities and landscapes, documented as vlogs." },
  { slug: "writing", title: "Writing", blurb: "Books and essays on design and place. PDF available." },
  { slug: "ventures", title: "Ventures", blurb: "Businesses built with the discipline of buildings." },
];
