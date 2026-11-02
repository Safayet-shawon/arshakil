import type { Field, Project, Service, SiteInfo } from "./content.types";

// Placeholder content, same shape as frontend/src/data. Swap for a database when the CMS arrives.
export const site: SiteInfo = {
  name: "Shakil",
  fullName: "AR. Shakhaouth Hossain Shakil",
  tagline: "Architect · Photographer · Traveller · Author · Content Creator · Social Worker",
  intro: "Designing spaces and stories that are calm, considered and built to last. Founder of studio Kolpo, Dhaka.",
  email: "hello@example.com",
  location: "Dhaka, Bangladesh",
  firm: "Kolpo",
  roles: ["Architect", "Photographer", "Traveller", "Author", "Content Creator", "Social Worker"],
};

export const fields: Field[] = [
  { slug: "architecture", title: "Architecture", blurb: "Solo projects and the work of studio Kolpo." },
  { slug: "photography", title: "Photography", blurb: "Buildings, people and places, one frame at a time." },
  { slug: "content-creation", title: "Content Creation", blurb: "Videos and vlogs on YouTube, Facebook, TikTok and Instagram." },
  { slug: "travel", title: "Travel", blurb: "Cities, landscapes and the history behind them." },
  { slug: "author", title: "Author", blurb: "Books and essays, free to read and download as PDF." },
  { slug: "social-work", title: "Social Work", blurb: "Community projects and giving back." },
];

export const projects: Project[] = [
  { slug: "p1", title: "House of Quiet Light", year: "2024", location: "Dhaka", type: "Residential · Solo", summary: "A courtyard house that follows the sun through the day." },
  { slug: "p2", title: "Riverside Pavilion", year: "2023", location: "Sylhet", type: "Hospitality · Solo", summary: "A timber and concrete pavilion that sits lightly on the water's edge." },
  { slug: "p3", title: "Brick Library", year: "2022", location: "Chattogram", type: "Public · Solo", summary: "A reading house built from reclaimed brick and filtered daylight." },
  { slug: "p4", title: "Studio Annex", year: "2021", location: "Dhaka", type: "Workplace · Solo", summary: "A compact creative studio with a single, generous room." },
];

export const services: Service[] = [
  { slug: "architecture", title: "Architectural Design", description: "Concept to construction for residential, commercial and cultural projects, through studio Kolpo.", priceFromUsd: 50, unit: "per sq. ft.", includes: ["Site study & brief", "Concept design", "Detailed drawings", "Site visits"] },
  { slug: "photography", title: "Photography", description: "Architectural, travel and editorial photography.", priceFromUsd: 300, unit: "per half-day", includes: ["Pre-shoot planning", "Edited high-res images", "Usage licence"] },
  { slug: "video", title: "Video & Content", description: "Travel films, brand stories and architectural walkthroughs.", priceFromUsd: 800, unit: "per project", includes: ["Script & storyboard", "Shoot & edit", "Colour grade", "Social cut-downs"] },
  { slug: "consulting", title: "Consulting & Talks", description: "Design consulting, workshops and speaking engagements.", priceFromUsd: 150, unit: "per hour", includes: ["Discovery call", "Written recommendations"] },
];
