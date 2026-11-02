export interface NavLink { label: string; href: string; external?: boolean }
export interface NavItem { label: string; href: string; count?: string; children?: NavLink[] }

export interface Field { slug: string; title: string; href: string; blurb: string }
export interface Social { label: string; href: string; icon: string; handle: string }

export interface Project { slug: string; title: string; year: string; location: string; type: string; summary: string; photo: string }
export interface Photo { photo: string; title: string; category: string }
export interface Video { title: string; group: string; thumb: string; youtubeId?: string }
export interface Destination { title: string; place: string; year: string; note: string; photo: string }
export interface Story { title: string; place: string; era: string; blurb: string; photo: string }
export interface Book { slug: string; title: string; subtitle: string; summary: string; pages: number; language: string; year: string; pdf: string }
export interface Initiative { title: string; area: string; blurb: string; photo: string }
export interface Service { slug: string; title: string; description: string; priceFromUsd: number; unit: string; includes: string[] }
export interface BestOf { category: string; title: string; meta: string; year: string; href: string; photo: string }

export interface ContactPayload { name: string; email: string; message: string }
