import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductCategory } from "./products";

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categories: string[] | null;
  subcategory: string | null;
  short_description: string | null;
  description: string | null;
  images: string[] | null;
  diamond_type: string | null;
  is_active: boolean;
};


function toProduct(p: DbProduct): Product {
  const dt = (p.diamond_type || "Both").toLowerCase();
  const diamondTypes: ("Natural" | "Lab Grown")[] =
    dt === "natural" ? ["Natural"] : dt === "lab grown" ? ["Lab Grown"] : ["Natural", "Lab Grown"];
  return {
    slug: p.slug,
    name: p.name,
    category: p.category as ProductCategory,
    collection: p.subcategory || "Oriva",
    short: p.short_description || "",
    description: p.description || "",
    image: p.images?.[0] || "",
    shape: "—",
    metal: "18K",
    diamondTypes,
    customizable: true,
  };
}

async function fetchDbProductsRaw(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id,slug,name,category,categories,subcategory,short_description,description,images,diamond_type,is_active")
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) return [];
  return ((data as DbProduct[]) ?? []).filter((p) => p.images && p.images.length > 0);
}

export function useDbProducts() {
  return useQuery({
    queryKey: ["db-products"],
    queryFn: async () => (await fetchDbProductsRaw()).map(toProduct),
    staleTime: 60_000,
  });
}

export function useDbProductsByCategory(category: ProductCategory) {
  const q = useQuery({
    queryKey: ["db-products-raw"],
    queryFn: fetchDbProductsRaw,
    staleTime: 60_000,
  });
  const filtered = (q.data ?? []).filter((p) => {
    const cats = p.categories && p.categories.length ? p.categories : [p.category];
    return cats.includes(category);
  });
  return { ...q, data: filtered.map(toProduct) };
}


