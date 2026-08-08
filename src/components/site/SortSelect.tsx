import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type SortKey = "featured" | "name-asc" | "name-desc" | "shape";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name: A – Z" },
  { value: "name-desc", label: "Name: Z – A" },
  { value: "shape", label: "By Shape" },
];

export function useSortedProducts(items: Product[]) {
  const [sort, setSort] = useState<SortKey>("featured");
  const sorted = useMemo(() => {
    const list = [...items];
    switch (sort) {
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "shape":
        return list.sort((a, b) => a.shape.localeCompare(b.shape));
      case "featured":
      default:
        return list;
    }
  }, [items, sort]);
  return { sort, setSort, sorted };
}

export function SortSelect({
  value,
  onChange,
  className = "",
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  className?: string;
}) {
  return (
    <label className={`inline-flex items-center gap-3 ${className}`}>
      <span className="text-[11px] md:text-[13px] tracking-[0.35em] uppercase text-ivory/55">
        Sort
      </span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="appearance-none bg-transparent border-b border-white/20 pl-1 pr-8 py-1.5 text-[12px] md:text-[13px] tracking-[0.3em] uppercase text-ivory focus:outline-none focus:border-gold cursor-pointer [&>option]:text-black"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-white text-black">
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gold">
          ▾
        </span>
      </span>
    </label>
  );
}
