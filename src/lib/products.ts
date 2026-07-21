import marquiseImg from "@/assets/product-marquise.jpg";
import ovalImg from "@/assets/product-oval.jpg";
import emeraldStudsImg from "@/assets/product-emerald-studs.jpg";
import tennisImg from "@/assets/product-tennis.jpg";
import pearImg from "@/assets/product-pear.jpg";
import heartImg from "@/assets/product-heart.jpg";

export type ProductCategory =
  | "engagement-rings"
  | "earrings"
  | "bracelets"
  | "pendants"
  | "bridal"
  | "lab-grown";

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  collection: string;
  short: string;
  description: string;
  image: string;
  shape: string;
  metal: string;
  diamondTypes: ("Natural" | "Lab Grown")[];
  carats?: string[];
  sizes?: string[];
  lengths?: string[];
  backings?: string[];
  customizable: boolean;
}

export const products: Product[] = [
  {
    slug: "marquise-solitaire-ring",
    name: "Marquise Solitaire Ring",
    category: "engagement-rings",
    collection: "The Solitaire Edit",
    short: "A commanding marquise-cut diamond, set on a whisper-thin band.",
    description:
      "Elongated, elegant and singular. Our signature marquise solitaire captures light along its two pointed apexes, extending the finger with quiet confidence. Hand-set by our atelier.",
    image: marquiseImg,
    shape: "Marquise",
    metal: "18K White Gold",
    diamondTypes: ["Natural", "Lab Grown"],
    carats: ["1.0 ct", "1.5 ct", "2.0 ct", "2.5 ct", "3.0 ct"],
    sizes: ["US 4", "US 5", "US 6", "US 7", "US 8", "US 9"],
    customizable: true,
  },
  {
    slug: "oval-hidden-halo-ring",
    name: "Oval Hidden Halo Ring",
    category: "engagement-rings",
    collection: "Bridal",
    short: "An oval centre stone lifted by a hidden halo of pavé diamonds.",
    description:
      "A modern classic. The hidden halo appears only when viewed from the profile - a private detail revealed to the wearer alone.",
    image: ovalImg,
    shape: "Oval",
    metal: "18K Yellow Gold",
    diamondTypes: ["Natural", "Lab Grown"],
    carats: ["1.0 ct", "1.5 ct", "2.0 ct", "2.5 ct"],
    sizes: ["US 4", "US 5", "US 6", "US 7", "US 8"],
    customizable: true,
  },
  {
    slug: "emerald-cut-studs",
    name: "Emerald Cut Diamond Studs",
    category: "earrings",
    collection: "Everyday Brilliance",
    short: "Architectural emerald-cut studs with a subtle diamond halo.",
    description:
      "Step-cut clarity meets a whisper of pavé. Designed for daily wear, engineered to catch light with every turn of the head.",
    image: emeraldStudsImg,
    shape: "Emerald",
    metal: "18K White Gold",
    diamondTypes: ["Natural", "Lab Grown"],
    carats: ["0.5 ct", "1.0 ct", "1.5 ct", "2.0 ct"],
    backings: ["Screw Back", "Push Back", "La Pousette"],
    customizable: true,
  },
  {
    slug: "tennis-bracelet",
    name: "Diamond Tennis Bracelet",
    category: "bracelets",
    collection: "The Line",
    short: "An uninterrupted line of round brilliants around the wrist.",
    description:
      "Precision-set round brilliant diamonds in a four-prong basket, hinged for a fluid drape. A quiet daily luxury.",
    image: tennisImg,
    shape: "Round Brilliant",
    metal: "18K White Gold",
    diamondTypes: ["Natural", "Lab Grown"],
    carats: ["3 ct total", "5 ct total", "7 ct total", "10 ct total"],
    lengths: ["6.5 in / 16.5 cm", "7.0 in / 17.8 cm", "7.5 in / 19.0 cm"],
    customizable: true,
  },
  {
    slug: "pear-diamond-ring",
    name: "Pear Diamond Ring",
    category: "engagement-rings",
    collection: "The Solitaire Edit",
    short: "A pear-shape solitaire, worn point-up.",
    description:
      "Softly rounded at one end and pointed at the other, the pear cut brings movement to the finger. Set in a tapered knife-edge band.",
    image: pearImg,
    shape: "Pear",
    metal: "18K Rose Gold",
    diamondTypes: ["Natural", "Lab Grown"],
    carats: ["1.0 ct", "1.5 ct", "2.0 ct", "2.5 ct"],
    sizes: ["US 4", "US 5", "US 6", "US 7", "US 8"],
    customizable: true,
  },
  {
    slug: "heart-drop-earrings",
    name: "Heart Drop Earrings",
    category: "earrings",
    collection: "Occasion",
    short: "Heart-cut diamonds suspended from a slender pavé bar.",
    description:
      "A romantic silhouette in miniature. Heart-shape diamonds drop from a pavé-set bar with articulated movement.",
    image: heartImg,
    shape: "Heart",
    metal: "18K White Gold",
    diamondTypes: ["Natural", "Lab Grown"],
    carats: ["0.5 ct", "1.0 ct", "1.5 ct"],
    backings: ["Lever Back", "Fixed Hook"],
    customizable: true,
  },
];

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export const categories: Record<ProductCategory, { label: string; blurb: string }> = {
  "engagement-rings": {
    label: "Engagement Rings",
    blurb: "Signature solitaires, hidden halos and heirloom silhouettes.",
  },
  earrings: {
    label: "Earrings",
    blurb: "Studs, drops and ear stacks - from everyday to occasion.",
  },
  bracelets: {
    label: "Bracelets",
    blurb: "Tennis lines and pavé bangles that trace the wrist in light.",
  },
  pendants: {
    label: "Pendants",
    blurb: "Solitaire and delicate diamond pendants for daily wear.",
  },
  bridal: {
    label: "Bridal Collection",
    blurb: "Engagement rings and wedding bands, made to be worn forever.",
  },
  "lab-grown": {
    label: "Lab Grown Diamonds",
    blurb: "Chemically identical to natural diamonds - with a modern conscience.",
  },
};

export const WHATSAPP_NUMBER = "85253176253";
export const WHATSAPP_DISPLAY = "+852 5317 6253";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
