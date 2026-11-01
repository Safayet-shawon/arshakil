import type { Project, Service } from "@/types";

export const approach =
  "I design buildings, frame photographs, cut films, walk unfamiliar cities and write about all of it. Different tools, one habit: looking carefully, then making something honest.";

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
