import type { Named, Service, SiteContent } from "@/types";

/**
 * What the site starts with. There is no sample content: every project, photo, video, book, place and initiative
 * on the site is something uploaded in the admin panel, and a section with nothing uploaded is simply not shown.
 */
export const approach =
  "I design buildings, frame photographs, cut films, walk unfamiliar cities and write about all of it. Different tools, one habit: looking carefully, then making something honest.";


export const categories: Named[] = ["Architecture", "Street", "Portrait", "Travel", "Author"].map((name) => ({ name }));

/** "Hire me as ..." cards. Custom-rate ones are quoted after the visitor sends a request. */
export const services: Service[] = [
  { slug: "architect", hire: "an Architect", rate: "custom",
    description: "Concept to construction for homes, workplaces and public buildings, through Kolpo and Studio Karu. There is no fixed rate: send your requirements and I'll reply with a quote.",
    includes: ["Site study & brief", "Concept design", "Detailed drawings", "Site visits"] },
  { slug: "architectural-photographer", hire: "an Architectural Photographer", rate: "fixed", priceFromUsd: 300, unit: "per half-day",
    description: "Architectural, interior and travel photography with a fixed day rate.",
    includes: ["Pre-shoot planning", "Edited high-res images", "Usage licence"] },
  { slug: "content-creator", hire: "a Content Creator", rate: "fixed", priceFromUsd: 800, unit: "per project",
    description: "Travel films, brand stories and architectural walkthroughs at a fixed project rate.",
    includes: ["Script & storyboard", "Shoot & edit", "Colour grade", "Social cut-downs"] },
  { slug: "consultant", hire: "a Consultant", rate: "custom", phone: true,
    description: "Design consulting, workshops and talks. There is no fixed rate: send a request, or call to talk it through.",
    includes: ["Discovery call", "Written recommendations", "Workshops & talks"] },
];

export const about = [
  "I'm an architect: co-founder of Kolpo in Dhaka and Studio Karu in Chittagong, and founder of WaQia and Roots organic. I design homes, libraries and small public places that feel calm and are built to last.",
  "Away from the drawing table I photograph buildings and the cities I walk through, travel across Bangladesh and abroad, write books and essays, and make videos about all of it.",
  "I also give time to social work: education support, clean-ups and neighbourhood programs. Different tools, one habit: looking carefully, then making something honest.",
];


/** The sections of the gallery offered in the admin panel's pickers. They only appear on the site once photos are added to them. */
export const defaults: SiteContent = {
  texts: {}, projects: [], gallery: [], categories, videos: [], videoGroups: [], places: [], placePosts: [], books: [], initiatives: [], services, stories: [], albums: [],
};
