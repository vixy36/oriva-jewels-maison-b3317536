export type BlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "image_text"
  | "gallery"
  | "quote"
  | "cta"
  | "divider"
  | "homepage_section"
  | "richtext";

export type PageBlock = {
  id: string;
  type: BlockType;
  /** heading / cta / image_text title */
  title?: string;
  /** eyebrow label above a heading */
  eyebrow?: string;
  /** paragraph, quote, image_text body */
  text?: string;
  /** quote attribution / image caption */
  caption?: string;
  /** single image url */
  image?: string;
  /** gallery image urls */
  images?: string[];
  /** cta */
  ctaLabel?: string;
  ctaHref?: string;
  /** image_text layout */
  reverse?: boolean;
  /** homepage section configuration */
  sectionType?: "index" | "atelier" | "occasions" | "instagram" | "custom";
  items?: {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    link: string;
    badge?: string;
  }[];
  html?: string;
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Section heading",
  paragraph: "Paragraph",
  image: "Full-width image",
  image_text: "Image + text",
  gallery: "Image gallery",
  quote: "Pull quote",
  cta: "Call to action",
  divider: "Divider",
  homepage_section: "Homepage Section",
  richtext: "Rich Text Content",
};

export function newBlock(type: BlockType): PageBlock {
  const id = `b_${Math.random().toString(36).slice(2, 10)}`;
  switch (type) {
    case "heading":
      return { id, type, eyebrow: "Chapter", title: "A new section" };
    case "paragraph":
      return { id, type, text: "Write your story here." };
    case "image":
      return { id, type, image: "", caption: "" };
    case "image_text":
      return { id, type, title: "Craft", text: "Describe this pillar.", image: "", reverse: false };
    case "gallery":
      return { id, type, images: ["", "", ""] };
    case "quote":
      return { id, type, text: "A quiet obsession with brilliance.", caption: "Oriva Jewels" };
    case "cta":
      return { id, type, title: "Begin your commission", ctaLabel: "Enquire", ctaHref: "/custom-order" };
    case "homepage_section":
      return { 
        id, 
        type, 
        sectionType: "index", 
        title: "New Section", 
        items: [{ id: "1", title: "Item 1", subtitle: "Chapter 01", image: "", link: "" }] 
      };
    default:
      return { id, type };
  }
}

export function parseBlocks(value: unknown): PageBlock[] {
  if (!value || !Array.isArray(value)) return [];
  // Clean up nulls or invalid objects from the array
  return (value as any[]).filter((b) => b && typeof b === "object" && typeof b.type === "string") as PageBlock[];
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
