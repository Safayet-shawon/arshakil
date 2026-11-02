import type { BestOf, Book, Destination, Initiative, Photo, Project, Service, Story, Video } from "@/types";

// Placeholder content. Photos are stock images in /public/photos (replace file-for-file with real ones).
export const approach =
  "I design buildings, frame photographs, cut films, walk unfamiliar cities and write about all of it. Different tools, one habit: looking carefully, then making something honest.";

export const projects: Project[] = [
  { slug: "p1", title: "House of Quiet Light", year: "2024", location: "Dhaka", type: "Residential · Solo", summary: "A courtyard house that follows the sun through the day.", photo: "arch-house-1" },
  { slug: "p2", title: "Riverside Pavilion", year: "2023", location: "Sylhet", type: "Hospitality · Solo", summary: "A timber pavilion that sits lightly on the water's edge.", photo: "arch-pavilion" },
  { slug: "p3", title: "Brick Library", year: "2022", location: "Chattogram", type: "Public · Solo", summary: "A reading house built from reclaimed brick and filtered daylight.", photo: "arch-library" },
  { slug: "p4", title: "Studio Annex", year: "2021", location: "Dhaka", type: "Workplace · Solo", summary: "A compact creative studio with a single, generous room.", photo: "arch-house-2" },
];

export const kolpoProjects: Project[] = [
  { slug: "k1", title: "Kolpo Residence 01", year: "2025", location: "Dhaka", type: "Residential · Kolpo", summary: "A firm project, placeholder text.", photo: "arch-brickarch" },
  { slug: "k2", title: "Kolpo Commons", year: "2024", location: "Cox's Bazar", type: "Mixed-use · Kolpo", summary: "A firm project, placeholder text.", photo: "arch-blueprint" },
  { slug: "k3", title: "Kolpo Workplace", year: "2023", location: "Dhaka", type: "Commercial · Kolpo", summary: "A firm project, placeholder text.", photo: "arch-house-2" },
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
export const galleryCategories = ["All", "Architecture", "Street", "Portrait", "Travel"];

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
];

export const destinations: Destination[] = [
  { title: "The Highlands", place: "Add location", year: "2024", note: "Layered ridges, cold mornings and long roads.", photo: "travel-ridges" },
  { title: "Island Coast", place: "Add location", year: "2023", note: "Salt air, slow days and wooden piers.", photo: "travel-beach" },
  { title: "Mountain Pass", place: "Add location", year: "2023", note: "A winding road and a view that never repeats.", photo: "travel-alpine" },
  { title: "Sunrise on the Water", place: "Add location", year: "2022", note: "A quiet structure floating in first light.", photo: "travel-sunrise" },
];

export const stories: Story[] = [
  { title: "Stepping Through the Old Town", place: "Add location", era: "Old quarter", blurb: "How a city's oldest streets explain the way its people live today.", photo: "travel-heritage" },
  { title: "Brick, Lime and Vines", place: "Add location", era: "Heritage", blurb: "Notes on materials that age well, and the buildings that let them.", photo: "arch-brickarch" },
  { title: "Side Streets After Rain", place: "Add location", era: "Everyday life", blurb: "History is also what's left on the pavement after the crowd goes home.", photo: "street-side" },
];

/** Put real PDFs in /public/pdfs and point `pdf` at them. */
export const books: Book[] = [
  { slug: "b1", title: "Book Title One", subtitle: "A subtitle", summary: "A short description of the book: what it explores and who it is for. Replace with the real blurb.", pages: 180, language: "English", year: "2023", pdf: "/pdfs/sample-book.pdf" },
  { slug: "b2", title: "Book Title Two", subtitle: "Another subtitle", summary: "A short description of the second book. Essays on design, place and a life in motion.", pages: 140, language: "Bangla", year: "2024", pdf: "/pdfs/sample-book.pdf" },
];

export const initiatives: Initiative[] = [
  { title: "Education Support", area: "Learning", blurb: "School spaces, supplies and mentoring for children who need a hand.", photo: "social-school" },
  { title: "Community Clean-Up", area: "Environment", blurb: "Volunteer days that clear riverbanks and public spaces.", photo: "social-forest" },
  { title: "Neighbourhood Programs", area: "Community", blurb: "Bringing neighbours together around shared, well-designed places.", photo: "social-group" },
];

export const services: Service[] = [
  { slug: "architecture", title: "Architectural Design", description: "Concept to construction for residential, commercial and cultural projects, through studio Kolpo.", priceFromUsd: 50, unit: "per sq. ft.", includes: ["Site study & brief", "Concept design", "Detailed drawings", "Site visits"] },
  { slug: "photography", title: "Photography", description: "Architectural, travel and editorial photography.", priceFromUsd: 300, unit: "per half-day", includes: ["Pre-shoot planning", "Edited high-res images", "Usage licence"] },
  { slug: "video", title: "Video & Content", description: "Travel films, brand stories and architectural walkthroughs.", priceFromUsd: 800, unit: "per project", includes: ["Script & storyboard", "Shoot & edit", "Colour grade", "Social cut-downs"] },
  { slug: "consulting", title: "Consulting & Talks", description: "Design consulting, workshops and speaking engagements.", priceFromUsd: 150, unit: "per hour", includes: ["Discovery call", "Written recommendations"] },
];

/** The home page's "Selected work": the best one from each field. */
export const bestOf: BestOf[] = [
  { category: "Architecture", title: "House of Quiet Light", meta: "Residential — Dhaka", year: "2024", href: "/architecture", photo: "arch-house-1" },
  { category: "Photography", title: "Wet Street", meta: "Street series", year: "2025", href: "/photography", photo: "street-newyork" },
  { category: "Content Creation", title: "Travel Vlog 01", meta: "YouTube", year: "2025", href: "/content-creation", photo: "content-camera" },
  { category: "Travel", title: "The Highlands", meta: "Travel story", year: "2024", href: "/travel", photo: "travel-ridges" },
  { category: "Author", title: "Book Title One", meta: "Book — PDF", year: "2023", href: "/author", photo: "author-room" },
  { category: "Social Work", title: "Education Support", meta: "Community project", year: "2025", href: "/social-work", photo: "social-school" },
];

export const about = [
  "I'm an architect and the founder of studio Kolpo in Dhaka. I design homes, libraries and small public places that feel calm and are built to last.",
  "Away from the drawing table I photograph the cities I walk through, travel with a camera, write books and essays, and make videos about all of it.",
  "I also give time to social work: education support, clean-ups and neighbourhood programs. Different tools, one habit: looking carefully, then making something honest.",
];
