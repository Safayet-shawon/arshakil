export interface SiteInfo {
  name: string;
  fullName: string;
  tagline: string;
  intro: string;
  email: string;
  location: string;
  firm: string;
  roles: string[];
}

export interface Field { slug: string; title: string; blurb: string }

export interface Project {
  slug: string;
  title: string;
  year: string;
  location: string;
  type: string;
  summary: string;
  image?: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  priceFromUsd: number;
  unit: string;
  includes: string[];
}
