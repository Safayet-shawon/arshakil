export interface NavItem { label: string; href: string; count?: string }

export interface Field {
  slug: string;
  title: string;
  blurb: string;
}

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

export interface Social { label: string; href: string; icon: string }

export interface ContactPayload { name: string; email: string; message: string }
