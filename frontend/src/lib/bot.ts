import { about, approach } from "@/data/content";
import { fields, site, socials } from "@/data/site";
import { usd } from "@/lib/utils";
import type { SiteContent } from "@/types";

export interface BotReply { text: string; links?: { label: string; href: string }[]; chips?: string[] }

/** The quick questions offered under the greeting and after unknown questions. */
export const CHIPS = ["About Shakil", "Services & pricing", "Architecture projects", "Photography", "Travel stories", "Books", "Social work", "Contact"];

const list = (items: string[], max = 5) => items.slice(0, max).map((s) => `• ${s}`).join("\n");

type Facts = Pick<SiteContent, "projects" | "gallery" | "categories" | "places" | "books" | "initiatives" | "services" | "videos">;

/**
 * No AI and no API: the bot reads the question for keywords (English, plus common Bangla spelled in English)
 * and answers from the site's own content, so it always matches what the pages say.
 */
const intents: { name: string; words: RegExp[] }[] = [
  { name: "thanks", words: [/\b(thanks?|thank you|thx|shukriya|dhonnobad|dhanyabad|valo|bhalo|great|nice|cool|awesome)\b/] },
  { name: "bye", words: [/\b(bye|goodbye|see you|tata|allah hafez|khoda hafez)\b/] },
  { name: "greet", words: [/\b(hi|hello|hey|hola|salam|assalamu\w*|assalamualaikum|namaskar|good (morning|evening|afternoon))\b/] },
  { name: "bot", words: [/\b(who are you|your name|are you (an? )?(ai|bot|robot|real|human)|chatbot|robot|tumi ke)\b/] },
  { name: "help", words: [/\b(help|what can you|options|menu|commands)\b/] },
  { name: "about", words: [/\b(about|who is|who\'s|shakil|shakhaouth|introduce|bio|biography|story|apni ke|kon)\b/, /\b(architect|founder)\b/] },
  { name: "companies", words: [/\b(kolpo|karu|studio karu|waqia|roots|company|companies|firm|office|co.?founder|organic)\b/] },
  { name: "services", words: [/\b(hire|hiring|service|services|price|prices|pricing|rate|rates|quote|budget|charge|fee|fees|how much|koto|daam|dam|taka|package)\b/, /\b(consult\w*|workshop|talk)\b/] },
  { name: "architecture", words: [/\b(architecture|architectural design|project|projects|building|buildings|house|houses|library|pavilion|residential|design|blueprint|portfolio)\b/] },
  { name: "photography", words: [/\b(photo|photos|photograph\w*|gallery|camera|picture|pictures|chobi|album|albums|street|portrait|shoot)\b/] },
  { name: "content", words: [/\b(video|videos|youtube|vlog|vlogs|content|tiktok|instagram|facebook|reel|reels|channel|social media|linkedin)\b/] },
  { name: "travel", words: [/\b(travel|traveller|trip|trips|place|places|visit|tour|destination|sylhet|cox\w*|bangladesh|abroad|country|city|map|bhromon|ghura)\b/] },
  { name: "books", words: [/\b(book|books|author|read|reading|pdf|essay|essays|writer|writing|boi|novel|buy|purchase|access|code|bkash|nagad|payment|pay)\b/] },
  { name: "social", words: [/\b(social work|social|volunteer|volunteers|charity|community|initiative|initiatives|donate|donation|clean|education|ngo|neighbourhood|neighborhood)\b/] },
  { name: "contact", words: [/\b(contact|email|e-mail|mail|phone|call|reach|touch|whatsapp|number|address|where|location|located|message|commission|commissions|available|availability|collaborate|work together)\b/] },
];

export function reply(question: string, c: Facts): BotReply {
  const q = question.toLowerCase().replace(/[^a-z0-9\s'.\-@]/g, " ").replace(/\s+/g, " ").trim();
  if (!q) return { text: "Type a question, or tap one of the buttons below.", chips: CHIPS };

  let best = "";
  let top = 0;
  for (const it of intents) {
    const score = it.words.reduce((n, re) => n + (re.test(q) ? 1 : 0), 0);
    // a longer, specific question about a topic beats a stray word like "ok"
    if (score > top) { top = score; best = it.name; }
  }
  // "thanks", "nice" and similar only count when nothing else matched
  if (best === "thanks" || best === "greet") {
    const other = intents.filter((i) => i.name !== "thanks" && i.name !== "greet").find((i) => i.words.some((re) => re.test(q)));
    if (other && q.split(" ").length > 2) best = other.name;
  }

  switch (best) {
    case "greet":
      return { text: "Hi! I'm Shakil's little assistant. I can tell you about his work, services, books, travel, or how to get in touch. What would you like to know?", chips: CHIPS };
    case "bot":
      return { text: "I'm a small robot living on this site. I'm not a real AI: I answer from what is on these pages, so the buttons below are the quickest way to ask me things.", chips: CHIPS };
    case "help":
      return { text: "I can talk about any part of the site. Pick one, or just type your question.", chips: CHIPS };
    case "thanks":
      return { text: "You're welcome! Anything else you'd like to know?", chips: ["Services & pricing", "Contact"] };
    case "bye":
      return { text: "Goodbye! Come back any time. I'll be down here in the corner." };
    case "about":
      return {
        text: `${site.fullName}: ${site.tagline}.\n\n${about[0]}`,
        links: [{ label: "Read more about Shakil", href: "/about" }],
        chips: ["Architecture projects", "Contact"],
      };
    case "companies":
      return {
        text: "Shakil co-founded Kolpo (Dhaka) and Studio Karu (Chittagong), and founded WaQia and Roots organic (Dhaka). Architecture projects are done through Kolpo and Studio Karu.",
        links: [{ label: "See the projects", href: "/architecture" }],
        chips: ["Architecture projects", "Contact"],
      };
    case "services":
      return {
        text: `You can hire Shakil in four ways:\n${list(c.services.map((s) => `${s.hire.replace(/^an? /, "")}: ${s.rate === "fixed" && s.priceFromUsd ? `from ${usd(s.priceFromUsd)} ${s.unit ?? ""}`.trim() : "custom quote after you send your requirements"}`))}\n\nSend a request and you'll get a reply.`,
        links: [{ label: "See services", href: "/#services" }, { label: "Send a request", href: "/#contact" }],
        chips: ["Contact", "Photography"],
      };
    case "architecture":
      return {
        text: `Selected architecture work (through Kolpo and Studio Karu):\n${list(c.projects.map((p) => `${p.title}: ${p.type.split(" · ")[0].toLowerCase()}, ${p.location} (${p.year})`), 6)}\n\n${approach}`.slice(0, 700),
        links: [{ label: "All architecture projects", href: "/architecture" }],
        chips: ["Services & pricing", "Contact"],
      };
    case "photography": {
      const cats = c.categories.map((x) => x.name).join(", ");
      return {
        text: `Architectural photography: buildings, people and places, one frame at a time. The gallery has ${c.gallery.length}+ photos in sections like ${cats}. Photos are grouped into albums, and the gallery has a "See all" view for each.`,
        links: [{ label: "Open the photography gallery", href: "/photography" }],
        chips: ["Services & pricing", "Travel stories"],
      };
    }
    case "content": {
      const groups = [...new Set(c.videos.map((v) => v.group))].join(", ");
      return {
        text: `Shakil makes videos and vlogs${groups ? ` (${groups})` : ""}. Find them on ${socials.slice(0, 4).map((s) => s.label).join(", ")}.`,
        links: [{ label: "Watch the videos", href: "/content-creation" }],
        chips: ["Services & pricing", "Contact"],
      };
    }
    case "travel": {
      const bd = c.places.filter((p) => p.region === "bangladesh").map((p) => p.name);
      const ab = c.places.filter((p) => p.region === "abroad").map((p) => p.name);
      return {
        text: `Travel posts with maps, ideas, trip costs and the history behind each place.${bd.length ? `\n\nIn Bangladesh: ${bd.join(", ")}.` : ""}${ab.length ? `\nAbroad: ${ab.join(", ")}.` : ""}`,
        links: [{ label: "Explore travel", href: "/travel" }],
        chips: ["Photography", "Books"],
      };
    }
    case "books":
      return {
        text: `Books and essays:\n${list(c.books.map((b) => `${b.title}: ${b.language}, ${b.pages} pages, ${b.priceBdt} BDT`))}\n\nThe first 5% of every book is free to read online. To read the rest, pay by bKash or Nagad and send your transaction ID: you'll get a personal access code.`,
        links: [{ label: "Open the books", href: "/author" }],
        chips: ["Contact", "Social work"],
      };
    case "social":
      return {
        text: `Shakil gives time to community work:\n${list(c.initiatives.map((i) => `${i.title}: ${i.blurb}`))}`,
        links: [{ label: "See social work", href: "/social-work" }],
        chips: ["Contact", "Travel stories"],
      };
    case "contact":
      return {
        text: `Based in ${site.location}.\nEmail: ${site.email}\nPhone: ${site.phone}\n\nThe fastest way is the contact form: tell Shakil about your project, story or idea.`,
        links: [{ label: "Go to the contact form", href: "/#contact" }],
        chips: ["Services & pricing", "About Shakil"],
      };
    default:
      return {
        text: `Sorry, I didn't catch that. I only know what's on this site (${fields.map((f) => f.title.toLowerCase()).join(", ")}, services and contact). Try one of these, or use the contact form and Shakil will reply himself.`,
        links: [{ label: "Contact form", href: "/#contact" }],
        chips: CHIPS,
      };
  }
}
