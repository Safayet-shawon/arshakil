export interface NavLink { label: string; href: string; external?: boolean }
export interface NavItem { label: string; href: string; count?: string; children?: NavLink[] }

export interface Field { slug: string; title: string; href: string; blurb: string }
export interface Social { label: string; href: string; icon: string; handle: string }

export interface Project { slug: string; title: string; year: string; location: string; type: string; summary: string; photo: string }
export interface Photo { photo: string; title: string; category: string }
export interface Video { title: string; group: string; thumb: string; youtubeId?: string }
export interface Story { title: string; place: string; era: string; blurb: string; photo: string }
export interface Book { slug: string; title: string; subtitle: string; summary: string; pages: number; language: string; year: string; pdf: string }
export interface Initiative { slug: string; title: string; area: string; blurb: string; photo: string; points: string[] }
export interface BestOf { category: string; title: string; meta: string; year: string; href: string; photo: string }

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

/** A travel post: shown as a pin on the map and as a post card below it. */
export interface PlacePost { title: string; text: string; youtubeId?: string }
export interface Place {
  posts?: PlacePost[];
  slug: string;
  name: string;
  region: "bangladesh" | "abroad";
  country: string;
  lat: number;
  lng: number;
  photo: string;
  summary: string;
  ideas: string[];
  cost: string;
}

export interface ContactPayload { name: string; email: string; message: string; service?: string }
