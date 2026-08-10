import round from "@/assets/diamond-shapes/round.png.asset.json";
import princess from "@/assets/diamond-shapes/princess.png.asset.json";
import oval from "@/assets/diamond-shapes/oval.png.asset.json";
import emerald from "@/assets/diamond-shapes/emerald.png.asset.json";
import pear from "@/assets/diamond-shapes/pear.png.asset.json";
import cushion from "@/assets/diamond-shapes/cushion.png.asset.json";
import marquise from "@/assets/diamond-shapes/marquise.png.asset.json";
import radiant from "@/assets/diamond-shapes/radiant.png.asset.json";
import asscher from "@/assets/diamond-shapes/asscher.png.asset.json";
import heart from "@/assets/diamond-shapes/heart.png.asset.json";

export const SHAPE_ICONS: Record<string, string> = {
  round: round.url,
  princess: princess.url,
  oval: oval.url,
  emerald: emerald.url,
  pear: pear.url,
  cushion: cushion.url,
  marquise: marquise.url,
  radiant: radiant.url,
  asscher: asscher.url,
  heart: heart.url,
};

export const shapeIcon = (name: string) => SHAPE_ICONS[name.toLowerCase()] ?? round.url;

export const DIAMOND_SHAPES = [
  "Round",
  "Princess",
  "Oval",
  "Emerald",
  "Pear",
  "Cushion",
  "Marquise",
  "Radiant",
  "Asscher",
  "Heart",
].map((name) => ({ name, icon: shapeIcon(name) }));
