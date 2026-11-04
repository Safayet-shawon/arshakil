import type { ListName, SiteContent } from "@/types";

/**
 * What the admin panel can edit. Each list is a table of items; `fields` describe the form.
 * `options` is a fixed list or the name of another list whose `name`/`slug` values are offered.
 */
export type FieldType = "text" | "textarea" | "number" | "image" | "images" | "video" | "select" | "bool" | "lines" | "pdf" | "readonly";
type Item = Record<string, unknown>;
export interface FieldDef {
  key: string; label: string; type: FieldType; hint?: string;
  /** Fixed choices, or another list's values; `filterBy` keeps only entries whose same-named field equals this item's. */
  options?: string[] | { value: string; label: string }[] | { list: ListName; value: string; label: string; filterBy?: string };
  /** Label that depends on the item being edited. */
  labelFor?: (item: Item) => string;
  /** Hide the field unless this is true for the item being edited. */
  showIf?: (item: Item) => boolean;
  /** When this field changes, these fields are cleared. */
  resets?: string[];
  /** Where an uploaded PDF is kept: books are private and paywalled, posts are public. */
  folder?: "books" | "posts";
  /** For an image field: also store the picture's width / height here, so it can be shown in its own shape. */
  ratioKey?: string;
  /** For a video field: also store the video's first picture here (used as a poster and, if chosen, as the thumbnail). */
  posterKey?: string;
}
export interface ListDef {
  name: ListName; label: string; singular: string; blurb: string;
  title: (item: Record<string, unknown>) => string;
  photo?: string; featurable?: boolean; slugFrom?: string; fields: FieldDef[]; blank: Record<string, unknown>;
  /** Fills in values an older saved item lacks, when it is opened for editing. */
  prepare?: (item: Item, c: SiteContent) => Item;
}

const str = (k: string) => (i: Record<string, unknown>) => String(i[k] ?? "Untitled");

export const lists: ListDef[] = [
  { name: "projects", label: "Architecture", singular: "project", blurb: "Upload and delete projects. Tick Featured to show one in the home page's Selected work.",
    title: str("title"), photo: "photo", featurable: true, slugFrom: "title",
    fields: [
      { key: "title", label: "Title", type: "text" }, { key: "year", label: "Year", type: "text" },
      { key: "location", label: "Location", type: "text" }, { key: "type", label: "Type (e.g. Residential · Kolpo)", type: "text" },
      { key: "summary", label: "Short description", type: "textarea" }, { key: "photo", label: "Thumbnail photo", type: "image" },
      { key: "photos", label: "More photos (add as many as you like)", type: "images" },
      { key: "video", label: "Short video (optional)", type: "video", posterKey: "videoPoster" },
      { key: "videoThumb", label: "Use the video as the thumbnail", type: "bool", showIf: (i) => !!i.video && !!i.videoPoster,
        hint: "The video's first picture becomes the thumbnail, and the thumbnail photo above is then counted with the other photos." },
      { key: "youtubeId", label: "Or a YouTube video id (optional)", type: "text" },
      { key: "featured", label: "Featured on the home page", type: "bool" },
    ], blank: { title: "", year: "", location: "", type: "", summary: "", photo: "", photos: [], video: "", videoPoster: "", videoThumb: false, youtubeId: "", featured: false } },

  { name: "gallery", label: "Architectural Photography", singular: "photo", blurb: "Every photo lives in a section (an album). Add one by one here, or use Bulk upload for many at once.",
    title: str("title"), photo: "photo", featurable: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "category", label: "Section", type: "select", options: { list: "categories", value: "name", label: "name" } },
      { key: "photo", label: "Photo", type: "image" },
      { key: "description", label: "Description (shown under the photo)", type: "textarea" },
      { key: "featured", label: "Featured on the home page", type: "bool" },
    ], blank: { title: "", category: "", photo: "", description: "", featured: false } },

  { name: "categories", label: "Photography sections", singular: "section", blurb: "Add, rename or remove the filter sections of the gallery. Renaming updates the photos in it.",
    title: str("name"), fields: [{ key: "name", label: "Section name", type: "text" }], blank: { name: "" } },

  { name: "videos", label: "Content Creation", singular: "video", blurb: "YouTube videos. Paste the video id (the part after v= in the link).",
    title: str("title"), photo: "thumb", featurable: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "group", label: "Group", type: "select", options: { list: "videoGroups", value: "name", label: "name" } },
      { key: "youtubeId", label: "YouTube video id", type: "text", hint: "Its thumbnail is used automatically" },
      { key: "thumb", label: "Custom thumbnail (optional)", type: "image" }, { key: "featured", label: "Featured on the home page", type: "bool" },
    ], blank: { title: "", group: "", youtubeId: "", thumb: "", featured: false } },

  { name: "videoGroups", label: "Video groups", singular: "group", blurb: "Sections of the Content Creation page. Renaming updates the videos in it.",
    title: str("name"), fields: [{ key: "name", label: "Group name", type: "text" }], blank: { name: "" } },

  { name: "places", label: "Travel places", singular: "place", blurb: "Bangladesh: add a new city. Abroad: add a new country. Each opens its own page with details.",
    title: str("name"), photo: "photo", featurable: false, slugFrom: "name",
    fields: [
      { key: "region", label: "Where", type: "select", options: [{ value: "bangladesh", label: "Bangladesh (a city)" }, { value: "abroad", label: "Abroad (a country)" }] },
      { key: "name", label: "City or country name", type: "text", labelFor: (i) => (i.region === "abroad" ? "Country name" : "City name") },
      { key: "summary", label: "Short description", type: "textarea" },
      { key: "ideas", label: "Things to do (one per line)", type: "lines" }, { key: "cost", label: "Estimated cost", type: "text" },
      { key: "photo", label: "Cover photo", type: "image" },
      { key: "photos", label: "More photos (add as many as you like)", type: "images" },
      { key: "video", label: "Short video (optional)", type: "video", posterKey: "videoPoster" },
      { key: "videoThumb", label: "Use the video as the thumbnail", type: "bool", showIf: (i) => !!i.video && !!i.videoPoster,
        hint: "The video's first picture becomes the thumbnail, and the thumbnail photo above is then counted with the other photos." },
      { key: "youtubeId", label: "Or a YouTube video id (optional)", type: "text" },
    ], blank: { region: "bangladesh", name: "", country: "Bangladesh", summary: "", ideas: [], cost: "", photo: "", photos: [], video: "", videoPoster: "", videoThumb: false, youtubeId: "" } },

  { name: "placePosts", label: "Travel posts", singular: "post", blurb: "Blog posts for a city or country. Write them here or upload a PDF. They appear on that place's page.",
    title: str("title"), slugFrom: "title",
    prepare: (it, c) => (it.region ? it : { ...it, region: c.places.find((p) => p.slug === it.place)?.region ?? "bangladesh" }),
    fields: [
      { key: "region", label: "Where", type: "select", options: [{ value: "bangladesh", label: "Bangladesh" }, { value: "abroad", label: "Abroad" }], resets: ["place"] },
      { key: "place", label: "City", type: "select", options: { list: "places", value: "slug", label: "name", filterBy: "region" },
        labelFor: (i) => (i.region === "abroad" ? "Country" : "City") },
      { key: "title", label: "Title", type: "text" },
      { key: "summary", label: "Short description", type: "textarea" },
      { key: "kind", label: "Blog", type: "select", options: [{ value: "write", label: "Write it on the website" }, { value: "pdf", label: "Upload a PDF" }] },
      { key: "text", label: "Write the blog", type: "textarea", showIf: (i) => i.kind !== "pdf", hint: "Leave a blank line between paragraphs" },
      { key: "pdf", label: "Blog PDF", type: "pdf", folder: "posts", showIf: (i) => i.kind === "pdf" },
      { key: "photos", label: "Photos (add as many as you like)", type: "images" },
      { key: "video", label: "Short video (optional)", type: "video", posterKey: "videoPoster" },
      { key: "youtubeId", label: "Or a YouTube video id (optional)", type: "text" },
    ], blank: { region: "bangladesh", place: "", title: "", summary: "", kind: "write", text: "", pdf: "", photos: [], video: "", videoPoster: "", youtubeId: "" } },

  { name: "books", label: "Author", singular: "book", blurb: "Upload a PDF, pick a thumbnail and a price in BDT. Readers get the first 5% free and need an access code for the rest. Nobody can download the file.",
    title: str("title"), photo: "thumb", featurable: true, slugFrom: "title",
    fields: [
      { key: "title", label: "Book title", type: "text" }, { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "thumb", label: "Book cover", type: "image", ratioKey: "thumbRatio", hint: "Upload the whole cover, portrait or landscape. It is shown in the cover's own shape." }, { key: "priceBdt", label: "Price (BDT, ৳)", type: "number" },
      { key: "summary", label: "Book description", type: "textarea" },
      { key: "content", label: "Book content (what is inside)", type: "textarea", hint: "Chapters or a table of contents" },
      { key: "language", label: "Language", type: "text" }, { key: "year", label: "Year", type: "text" },
      { key: "pdf", label: "Book PDF", type: "pdf" }, { key: "pages", label: "Pages (filled from the PDF)", type: "readonly" },
      { key: "featured", label: "Featured on the home page", type: "bool" },
    ], blank: { title: "", subtitle: "", thumb: "", priceBdt: 300, summary: "", content: "", language: "English", year: "", pdf: "", pages: 0, featured: false } },

  { name: "initiatives", label: "Social Work", singular: "initiative", blurb: "Each initiative opens its own page.",
    title: str("title"), photo: "photo", featurable: true, slugFrom: "title",
    fields: [
      { key: "title", label: "Name", type: "text" }, { key: "area", label: "Area (e.g. Learning)", type: "text" },
      { key: "blurb", label: "Short description", type: "textarea" }, { key: "points", label: "What it does (one per line)", type: "lines" },
      { key: "photo", label: "Main photo", type: "image" },
      { key: "photos", label: "More photos (add as many as you like)", type: "images" },
      { key: "video", label: "Short video (optional)", type: "video", posterKey: "videoPoster" },
      { key: "videoThumb", label: "Use the video as the thumbnail", type: "bool", showIf: (i) => !!i.video && !!i.videoPoster,
        hint: "The video's first picture becomes the thumbnail, and the thumbnail photo above is then counted with the other photos." },
      { key: "youtubeId", label: "Or a YouTube video id (optional)", type: "text" },
      { key: "featured", label: "Featured on the home page", type: "bool" },
    ], blank: { title: "", area: "", blurb: "", points: [], photo: "", photos: [], video: "", videoPoster: "", videoThumb: false, youtubeId: "", featured: false } },

  { name: "services", label: "Services & Fees", singular: "service", blurb: "The \"Hire me as…\" cards. Custom ones are quoted after a request.",
    title: str("hire"), slugFrom: "hire",
    fields: [
      { key: "hire", label: "Hire me as… (e.g. an Architect)", type: "text" },
      { key: "rate", label: "Rate", type: "select", options: ["fixed", "custom"] },
      { key: "priceFromUsd", label: "Fixed price (USD)", type: "number" }, { key: "unit", label: "Unit (e.g. per half-day)", type: "text" },
      { key: "description", label: "Description", type: "textarea" }, { key: "includes", label: "Includes (one per line)", type: "lines" },
      { key: "phone", label: "Show the phone number", type: "bool" },
    ], blank: { hire: "", rate: "custom", priceFromUsd: 0, unit: "", description: "", includes: [], phone: false } },

  { name: "stories", label: "History & heritage", singular: "story", blurb: "Stories on the Travel page.",
    title: str("title"), photo: "photo",
    fields: [
      { key: "title", label: "Title", type: "text" }, { key: "place", label: "Place", type: "text" }, { key: "era", label: "Era", type: "text" },
      { key: "blurb", label: "Text", type: "textarea" }, { key: "photo", label: "Photo", type: "image" },
    ], blank: { title: "", place: "", era: "", blurb: "", photo: "" } },
];

lists.push({
  name: "albums", label: "Albums", singular: "album", blurb: "Photo albums for each part of the site.",
  title: str("name"), slugFrom: "name", photo: "cover",
  fields: [{ key: "name", label: "Album name", type: "text" }, { key: "description", label: "Description", type: "textarea" }],
  blank: { sector: "architecture", name: "", description: "", photos: [] },
});

export const listByName = (n: string) => lists.find((l) => l.name === n);
