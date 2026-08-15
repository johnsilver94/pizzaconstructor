export const CATEGORY_SLUGS = [
  "pizza",
  "salad",
  "desert",
  "beverages",
  "vegan",
] as const;

export interface ProductInput {
  name: string;
  category: (typeof CATEGORY_SLUGS)[number];
  description?: string;
  image?: string;
  ingredients: { name: string }[];
  allergens: { name: string }[];
  sizePrices: { size: string; price: number; weightG?: number }[];
}

export function validateProductInput(input: unknown): ProductInput {
  if (!input || typeof input !== "object") {
    throw new Error("Product input must be an object");
  }

  const p = input as Partial<ProductInput>;

  if (!p.name || typeof p.name !== "string") {
    throw new Error("Product name is required and must be a string");
  }

  if (!p.category || !CATEGORY_SLUGS.includes(p.category as (typeof CATEGORY_SLUGS)[number])) {
    throw new Error(`Category must be one of: ${CATEGORY_SLUGS.join(", ")}`);
  }

  if (!Array.isArray(p.sizePrices) || p.sizePrices.length === 0) {
    throw new Error("Product must have at least one size & price option");
  }

  return {
    name: p.name.trim(),
    category: p.category,
    description: p.description?.trim(),
    image: p.image?.trim() || "/img/pizza_medium.png",
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
    allergens: Array.isArray(p.allergens) ? p.allergens : [],
    sizePrices: p.sizePrices.map((sp) => ({
      size: String(sp.size),
      price: Number(sp.price),
      weightG: sp.weightG ? Number(sp.weightG) : undefined,
    })),
  };
}
