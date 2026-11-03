import type { BestOf, Book, Initiative, Named, Photo, Place, PlacePost, Project, Service, SiteContent, Story, Video } from "@/types";

// Placeholder content. Photos are stock images in /public/photos (replace file-for-file with real ones).
export const approach =
  "I design buildings, frame photographs, cut films, walk unfamiliar cities and write about all of it. Different tools, one habit: looking carefully, then making something honest.";

/** All selected projects together (solo, Kolpo and Studio Karu); no separate studio sections. */
export const projects: Project[] = [
  { slug: "p1", title: "House of Quiet Light", year: "2024", location: "Dhaka", type: "Residential · Kolpo", summary: "A courtyard house that follows the sun through the day.", photo: "arch-house-1" },
  { slug: "p2", title: "Riverside Pavilion", year: "2023", location: "Sylhet", type: "Hospitality · Kolpo", summary: "A timber pavilion that sits lightly on the water's edge.", photo: "arch-pavilion" },
  { slug: "p3", title: "Brick Library", year: "2022", location: "Chattogram", type: "Public · Studio Karu", summary: "A reading house built from reclaimed brick and filtered daylight.", photo: "arch-library" },
  { slug: "p4", title: "Studio Annex", year: "2021", location: "Dhaka", type: "Workplace · Kolpo", summary: "A compact creative studio with a single, generous room.", photo: "arch-house-2" },
  { slug: "p5", title: "Vine Court Residence", year: "2025", location: "Dhaka", type: "Residential · Kolpo", summary: "Placeholder text for a selected project.", photo: "arch-brickarch" },
  { slug: "p6", title: "Harbour Commons", year: "2024", location: "Chattogram", type: "Mixed-use · Studio Karu", summary: "Placeholder text for a selected project.", photo: "arch-blueprint" },
  { slug: "p7", title: "Roots Workplace", year: "2023", location: "Dhaka", type: "Commercial · Kolpo", summary: "Placeholder text for a selected project.", photo: "arch-house-2" },
];

export const gallery: Photo[] = [
  { photo: "street-newyork", title: "Wet Street", category: "Street" },
  { photo: "travel-ridges", title: "Warm Ridges", category: "Travel" },
  { photo: "arch-brickarch", title: "Brick and Vine", category: "Architecture" },
  { photo: "portrait-1", title: "Quiet Portrait", category: "Portrait" },
  { photo: "travel-sunrise", title: "Sunrise on Water", category: "Travel" },
  { photo: "street-woman", title: "Walking Alone", category: "Street" },
  { photo: "arch-library", title: "Reading Room", category: "Architecture" },
  { photo: "travel-road", title: "The Winding Road", category: "Travel" },
  { photo: "street-side", title: "Side Streets", category: "Street" },
  { photo: "arch-pavilion", title: "Pavilion at Dawn", category: "Architecture" },
  { photo: "travel-alpine", title: "Alpine Light", category: "Travel" },
  { photo: "street-rain", title: "Puddles", category: "Street" },
  { photo: "arch-house-2", title: "Angles", category: "Architecture" },
  { photo: "travel-beach", title: "Island Coast", category: "Travel" },
];
export const categories: Named[] = ["Architecture", "Street", "Portrait", "Travel"].map((name) => ({ name }));

/** Add a real `youtubeId` to any video: its YouTube thumbnail and link are used automatically. */
export const videos: Video[] = [
  { group: "Travel vlogs", title: "Travel Vlog 01 — The Highlands", thumb: "travel-road" },
  { group: "Travel vlogs", title: "Travel Vlog 02 — Island Coast", thumb: "travel-beach" },
  { group: "Travel vlogs", title: "Travel Vlog 03 — The Old Town", thumb: "travel-heritage" },
  { group: "Architecture walkthroughs", title: "House of Quiet Light — Walkthrough", thumb: "arch-house-1" },
  { group: "Architecture walkthroughs", title: "Brick Library — Walkthrough", thumb: "arch-library" },
  { group: "Architecture walkthroughs", title: "Riverside Pavilion — Walkthrough", thumb: "arch-pavilion" },
  { group: "Behind the scenes", title: "How I Shoot a Building", thumb: "content-camera" },
  { group: "Behind the scenes", title: "A Day at the Studio", thumb: "arch-blueprint" },
  { group: "Behind the scenes", title: "Editing at the Café", thumb: "content-cafe" },
  { group: "Architectural knowledge", title: "How Light Shapes a Room", thumb: "arch-house-2" },
  { group: "Architectural knowledge", title: "Why Brick Ages So Well", thumb: "arch-brickarch" },
  { group: "Architectural knowledge", title: "Reading a Floor Plan", thumb: "author-room" },
];

const maps = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
export const mapLink = maps;

/**
 * Travel posts. Bangladesh posts are pinned on the Bangladesh map, "abroad" ones on the world map.
 * Replace the sample text, ideas and costs with the real story of each trip.
 */
export const places: Place[] = [
  { slug: "sylhet", name: "Sylhet", region: "bangladesh", country: "Bangladesh", lat: 24.8949, lng: 91.8687, photo: "travel-road",
    summary: "Tea gardens, swamp forest and river-border hills in the north-east.",
    ideas: ["Ratargul Swamp Forest by boat", "Jaflong and the Piyain river", "Walk the tea gardens at Lakkatura"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "coxs-bazar", name: "Cox's Bazar", region: "bangladesh", country: "Bangladesh", lat: 21.4272, lng: 92.0058, photo: "travel-beach",
    summary: "One of the longest natural sea beaches in the world.",
    ideas: ["Sunset at Laboni Point", "Drive the marine drive to Inani", "Himchari waterfall"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "bandarban", name: "Bandarban", region: "bangladesh", country: "Bangladesh", lat: 22.1953, lng: 92.2184, photo: "travel-ridges",
    summary: "Layered hills, tribal villages and cloud-level viewpoints.",
    ideas: ["Nilgiri sunrise", "Nafakhum waterfall", "Boga Lake trek"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "sundarbans", name: "Sundarbans", region: "bangladesh", country: "Bangladesh", lat: 22.1, lng: 89.5, photo: "travel-sunrise",
    summary: "The mangrove forest at the mouth of the Ganges, home of the Royal Bengal tiger.",
    ideas: ["Boat safari from Mongla", "Karamjal wildlife centre", "Hiron Point at dawn"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "saint-martin", name: "Saint Martin's Island", region: "bangladesh", country: "Bangladesh", lat: 20.6276, lng: 92.322, photo: "travel-beach",
    summary: "A small coral island at the country's southern tip.",
    ideas: ["Walk to Chhera Dwip at low tide", "Sunset on the west beach", "Coral shoreline walk"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "srimangal", name: "Srimangal", region: "bangladesh", country: "Bangladesh", lat: 24.3065, lng: 91.7296, photo: "travel-road",
    summary: "The tea capital: rolling gardens and Lawachara forest.",
    ideas: ["Lawachara National Park", "Seven-layer tea", "Madhabpur Lake"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "rangamati", name: "Rangamati", region: "bangladesh", country: "Bangladesh", lat: 22.6372, lng: 92.201, photo: "travel-alpine",
    summary: "Kaptai Lake, hanging bridge and hill-side towns.",
    ideas: ["Boat ride on Kaptai Lake", "Hanging Bridge", "Shuvolong waterfall"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "old-dhaka", name: "Old Dhaka", region: "bangladesh", country: "Bangladesh", lat: 23.7104, lng: 90.4074, photo: "travel-heritage",
    summary: "Narrow lanes, old mansions and four centuries of layered history.",
    ideas: ["Lalbagh Fort", "Ahsan Manzil", "Armenian Church and the river ghats"],
    cost: "Trip cost: add your numbers (transport · stay · food)" },
  { slug: "sri-lanka", name: "Sri Lanka", region: "abroad", country: "Sri Lanka", lat: 7.8731, lng: 80.7718, photo: "travel-beach",
    summary: "Tea hills, southern beaches and old colonial forts in a small island.",
    ideas: ["Train from Kandy to Ella", "Galle Fort at sunset", "Sigiriya rock at first light"],
    cost: "Itinerary and budget: add your numbers (flights · stay · food)" },
  { slug: "nepal", name: "Nepal", region: "abroad", country: "Nepal", lat: 28.3949, lng: 84.124, photo: "travel-alpine",
    summary: "Himalayan trails, Kathmandu's old squares and lakeside Pokhara.",
    ideas: ["Kathmandu Durbar Square", "Sunrise at Sarangkot, Pokhara", "A short trek in the Annapurna foothills"],
    cost: "Itinerary and budget: add your numbers (flights · stay · food)" },
  { slug: "india", name: "India", region: "abroad", country: "India", lat: 20.5937, lng: 78.9629, photo: "travel-heritage",
    summary: "Forts, temples and street food across very different regions.",
    ideas: ["The Taj Mahal at dawn", "Old Delhi lanes", "Jaipur's palaces and step wells"],
    cost: "Itinerary and budget: add your numbers (flights · stay · food)" },
  { slug: "saudi-arabia", name: "Saudi Arabia", region: "abroad", country: "Saudi Arabia", lat: 23.8859, lng: 45.0792, photo: "travel-sunrise",
    summary: "Desert landscapes, Al-Ula's rock tombs and the old quarters of Jeddah.",
    ideas: ["Al-Ula and Hegra", "Historic Jeddah (Al-Balad)", "Edge of the World, Riyadh"],
    cost: "Itinerary and budget: add your numbers (flights · stay · food)" },
];

/** History & heritage of Bangladesh (travel stories). */
export const stories: Story[] = [
  { title: "Stepping Through Old Dhaka", place: "Dhaka, Bangladesh", era: "Mughal and colonial layers", blurb: "How the old quarter's lanes, mansions and ghats explain the way the city lives today.", photo: "travel-heritage" },
  { title: "Brick, Lime and Vines", place: "Bangladesh", era: "Heritage", blurb: "Notes on terracotta, brick and lime: materials that age well, and the buildings that let them.", photo: "arch-brickarch" },
  { title: "Side Streets After Rain", place: "Bangladesh", era: "Everyday life", blurb: "History is also what's left on the pavement after the crowd goes home.", photo: "street-side" },
];

/** Sample books read the private sample PDF (`pdf: "seed"`). Real books are uploaded in the admin panel. */
export const books: Book[] = [
  { slug: "book-title-one", title: "Book Title One", subtitle: "A subtitle", summary: "A short description of the book: what it explores and who it is for. Replace with the real blurb.",
    content: "Chapter 1 — Placeholder\nChapter 2 — Placeholder\nChapter 3 — Placeholder", pages: 24, language: "English", year: "2023", priceBdt: 350, thumb: "author-notebook", pdf: "seed" },
  { slug: "book-title-two", title: "Book Title Two", subtitle: "Another subtitle", summary: "A short description of the second book. Essays on design, place and a life in motion.",
    content: "Chapter 1 — Placeholder\nChapter 2 — Placeholder", pages: 24, language: "Bangla", year: "2024", priceBdt: 250, thumb: "author-shelf", pdf: "seed" },
];

export const initiatives: Initiative[] = [
  { slug: "education-support", title: "Education Support", area: "Learning", photo: "social-school",
    blurb: "School spaces, supplies and mentoring for children who need a hand.",
    points: ["School supplies and learning kits", "Mentoring and reading hours", "Safer, brighter classroom spaces"] },
  { slug: "community-clean-up", title: "Community Clean-Up", area: "Environment", photo: "social-forest",
    blurb: "Volunteer days that clear riverbanks and public spaces.",
    points: ["Riverbank and park clean-up days", "Waste sorting with local volunteers", "Tree planting afterwards"] },
  { slug: "neighbourhood-programs", title: "Neighbourhood Programs", area: "Community", photo: "social-group",
    blurb: "Bringing neighbours together around shared, well-designed places.",
    points: ["Shared community spaces", "Neighbourhood design workshops", "Local events and gatherings"] },
];

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

/** The home page's "Selected work": the best one from each field. */
export const bestOf: BestOf[] = [
  { category: "Architecture", title: "House of Quiet Light", meta: "Residential — Dhaka", year: "2024", href: "/architecture", photo: "arch-house-1" },
  { category: "Architectural Photography", title: "Wet Street", meta: "Street series", year: "2025", href: "/photography", photo: "street-newyork" },
  { category: "Content Creation", title: "Travel Vlog 01", meta: "YouTube", year: "2025", href: "/content-creation", photo: "content-camera" },
  { category: "Travel", title: "Sylhet", meta: "Bangladesh — travel post", year: "2024", href: "/travel", photo: "travel-road" },
  { category: "Author", title: "Book Title One", meta: "Book — PDF", year: "2023", href: "/author", photo: "author-room" },
  { category: "Social Work", title: "Education Support", meta: "Community initiative", year: "2025", href: "/social-work/education-support", photo: "social-school" },
];

export const about = [
  "I'm an architect: co-founder of Kolpo in Dhaka and Studio Karu in Chittagong, and founder of WaQia and Roots organic. I design homes, libraries and small public places that feel calm and are built to last.",
  "Away from the drawing table I photograph buildings and the cities I walk through, travel across Bangladesh and abroad, write books and essays, and make videos about all of it.",
  "I also give time to social work: education support, clean-ups and neighbourhood programs. Different tools, one habit: looking carefully, then making something honest.",
];

export const videoGroups: Named[] = [...new Set(videos.map((v) => v.group))].map((name) => ({ name }));

export const placePosts: PlacePost[] = [
  { place: "sylhet", title: "Ratargul by boat", text: "Sample post: replace with your own notes, tips and photos from Sylhet." },
  { place: "sylhet", title: "Sylhet travel vlog", text: "Sample video post: add a YouTube video id to show the real thumbnail and link." },
  { place: "sri-lanka", title: "Kandy to Ella by train", text: "Sample post: replace with your own notes, tips and photos from this trip." },
];

/** What the site shows until something is changed in the admin panel. */
export const defaults: SiteContent = {
  texts: {}, projects, gallery, categories, videos, videoGroups, places, placePosts, books, initiatives, services, stories,
};
