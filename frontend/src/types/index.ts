export interface NavLink { label: string; href: string; external?: boolean }
export interface NavItem { label: string; href: string; count?: string; children?: NavLink[] }

export interface Field { slug: string; title: string; href: string; blurb: string }
export interface Social { label: string; href: string; icon: string; handle: string }

/** `featured` items are listed in the home page's "Selected work". `photo` is a /photos name or an uploaded /api/media path. */
interface Featurable { featured?: boolean }
/** Extra pictures and one short video (an uploaded file and/or a YouTube id) shown on an item's own page. */
export interface Media { photos?: string[]; video?: string; videoPoster?: string; videoThumb?: boolean; youtubeId?: string }
export interface Project extends Featurable, Media { slug: string; title: string; year: string; location: string; type: string; summary: string; photo: string }
export interface Photo extends Featurable { photo: string; title: string; category: string; description?: string }
export interface Video extends Featurable { title: string; group: string; thumb: string; youtubeId?: string }
export interface Story { title: string; place: string; era: string; blurb: string; photo: string }
export interface Initiative extends Featurable, Media { slug: string; title: string; area: string; blurb: string; photo: string; points: string[] }
export interface Named { name: string }
export interface BestOf { category: string; title: string; meta: string; year: string; href: string; photo: string }

/**
 * A book. `pdf` is a private key: it never reaches the browser (see lib/server/content.ts).
 * Prices are in BDT. The first 5% of pages are free to read, the rest needs an access code.
 */
export interface Book extends Featurable {
  slug: string; title: string; subtitle: string; summary: string; content: string;
  pages: number; language: string; year: string; priceBdt: number; thumb: string; thumbRatio?: number; pdf: string;
}

/** One "Hire me as ..." card. `custom` rates are quoted after a request; `fixed` ones show a price. */
export interface Service {
  slug: string;
  hire: string;
  description: string;
  rate: "fixed" | "custom";
  priceFromUsd?: number;
  unit?: string;
  includes: string[];
  phone?: boolean;
}

/** A city (Bangladesh) or a country (abroad). Its page lists the details and the posts added for it. */
export interface Place extends Featurable, Media {
  slug: string;
  name: string;
  region: "bangladesh" | "abroad";
  country: string;
  photo: string;
  summary: string;
  ideas: string[];
  cost: string;
  lat?: number;
  lng?: number;
}
/** A blog post on a place's page: written on the website (`text`) or uploaded as a PDF (`pdf`). */
export interface PlacePost extends Media {
  slug?: string; region?: "bangladesh" | "abroad"; place: string; title: string; summary?: string;
  kind?: "write" | "pdf"; text: string; pdf?: string;
}

export interface ContactPayload { name: string; email: string; message: string; service?: string; website?: string }

/** A photo album on one of the site's sectors. Its first photo is the cover. */
export type Sector = "architecture" | "travel" | "author" | "social-work" | "content-creation";
export interface AlbumPhoto { photo: string; title: string; description?: string }
export interface Album { slug: string; sector: Sector; name: string; description: string; photos: AlbumPhoto[] }

/** Everything the admin can edit. Defaults live in data/content.ts; saved changes override them. */
export interface SiteContent {
  texts: Record<string, string>;
  projects: Project[];
  gallery: Photo[];
  categories: Named[];
  videos: Video[];
  videoGroups: Named[];
  places: Place[];
  placePosts: PlacePost[];
  books: Book[];
  initiatives: Initiative[];
  services: Service[];
  stories: Story[];
  albums: Album[];
}
export type ListName = Exclude<keyof SiteContent, "texts">;

/** Server-only: who may read which book, and who asked. */
export interface AccessCode { code: string; book: string; label: string; createdAt: string }
export interface AccessRequest { id: string; book: string; name: string; contact: string; txn: string; createdAt: string; status: "new" | "granted"; code?: string }
export interface PrivateData { codes: AccessCode[]; requests: AccessRequest[] }
