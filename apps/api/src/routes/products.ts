import { Elysia, t } from "elysia";
import { ProductModel } from "../db/models/Product";
import { seedCatalogData } from "../db/seed";
import type { CategorySlug, Product } from "@pizzaconstructor/shared";

export const CATEGORY_DEFINITIONS = [
  {
    slug: "pizza" as CategorySlug,
    title: "Pizza",
    description: "Handcrafted artisan pizzas baked with fresh dough and premium ingredients.",
    activeIcon: "/img/categories/pizza_color.svg",
    inactiveIcon: "/img/categories/food.svg",
  },
  {
    slug: "salad" as CategorySlug,
    title: "Salads",
    description: "Freshly prepared salads with crisp greens and savory vinaigrettes.",
    activeIcon: "/img/categories/salad_color.svg",
    inactiveIcon: "/img/categories/fork.svg",
  },
  {
    slug: "desert" as CategorySlug,
    title: "Desserts",
    description: "Indulgent Italian pastries, cakes, and authentic desserts.",
    activeIcon: "/img/categories/cupcake_color.svg",
    inactiveIcon: "/img/categories/icecream.svg",
  },
  {
    slug: "beverages" as CategorySlug,
    title: "Beverages",
    description: "Chilled soft drinks, mineral water, fresh juices, and craft beers.",
    activeIcon: "/img/categories/cocktail_color.svg",
    inactiveIcon: "/img/categories/cocktail.svg",
  },
  {
    slug: "vegan" as CategorySlug,
    title: "Vegan",
    description: "100% plant-based pizzas, bowls, and desserts crafted without compromise.",
    activeIcon: "/img/categories/veganfork_color.svg",
    inactiveIcon: "/img/categories/vegan.svg",
  },
];

function mapDocToProduct(doc: Record<string, unknown>): Product {
  const rawId = doc._id || doc.id || "";
  return {
    id: String(rawId),
    _id: String(rawId),
    name: String(doc.name || ""),
    category: doc.category as CategorySlug,
    description: doc.description ? String(doc.description) : undefined,
    image: doc.image ? String(doc.image) : "/img/pizza_medium.png",
    ingredients: Array.isArray(doc.ingredients) ? doc.ingredients : [],
    allergens: Array.isArray(doc.allergens) ? doc.allergens : [],
    sizePrices: Array.isArray(doc.sizePrices) ? doc.sizePrices : [],
    isAvailable: doc.isAvailable !== false,
    createdAt: doc.createdAt ? new Date(String(doc.createdAt)).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(String(doc.updatedAt)).toISOString() : undefined,
  };
}

const getProductsHandler = async ({ query }: { query: { category?: string; search?: string; limit?: number; skip?: number } }) => {
  const { category, search, limit = 50, skip = 0 } = query;

  try {
    const filter: Record<string, unknown> = { isAvailable: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search && search.trim().length > 0) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    const items = await ProductModel.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    if (items && items.length > 0) {
      const total = await ProductModel.countDocuments(filter);
      return {
        items: items.map((doc) => mapDocToProduct(doc as unknown as Record<string, unknown>)),
        total,
        category: category || "all",
      };
    }
  } catch {
    // Fallback to in-memory seed data if MongoDB is unreachable
  }

  // In-Memory Fallback
  let fallbackItems: Product[] = seedCatalogData.map((item, idx) => ({
    _id: `seed-product-${idx + 1}`,
    id: `seed-product-${idx + 1}`,
    ...item,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  if (category && category !== "all") {
    fallbackItems = fallbackItems.filter((i) => i.category === category);
  }

  if (search && search.trim().length > 0) {
    const term = search.trim().toLowerCase();
    fallbackItems = fallbackItems.filter(
      (i) =>
        i.name.toLowerCase().includes(term) ||
        (i.description && i.description.toLowerCase().includes(term)) ||
        i.ingredients.some((ing) => ing.name.toLowerCase().includes(term))
    );
  }

  const total = fallbackItems.length;
  const paginated = fallbackItems.slice(Number(skip), Number(skip) + Number(limit));

  return {
    items: paginated,
    total,
    category: category || "all",
  };
};

const productsQuerySchema = {
  query: t.Object({
    category: t.Optional(t.String()),
    search: t.Optional(t.String()),
    limit: t.Optional(t.Numeric()),
    skip: t.Optional(t.Numeric()),
  }),
  detail: {
    summary: "Get products catalog with optional category filtering and search",
    tags: ["Catalog"],
  },
};

const getCategoriesHandler = async () => {
  const counts: Record<string, number> = {};

  try {
    const aggr = await ProductModel.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    for (const item of aggr) {
      counts[item._id] = item.count;
    }
  } catch {
    // Fallback
    for (const item of seedCatalogData) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
  }

  const categories = CATEGORY_DEFINITIONS.map((def) => ({
    ...def,
    count: counts[def.slug] || 0,
  }));

  return {
    categories,
    totalCategories: categories.length,
  };
};

const categoriesSchema = {
  detail: {
    summary: "List all product categories with item counts and icon assets",
    tags: ["Catalog"],
  },
};

export const productsRoutes = new Elysia({ prefix: "/products" })
  .get("/", getProductsHandler, productsQuerySchema)
  .get("/index", getProductsHandler, productsQuerySchema)
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const product = await ProductModel.findById(id).lean();
        if (product) {
          return mapDocToProduct(product as unknown as Record<string, unknown>);
        }
      } catch {
        // Fallback check
      }

      const found = seedCatalogData.find(
        (item, idx) =>
          `seed-product-${idx + 1}` === id ||
          item.name.toLowerCase().replace(/\s+/g, "-") === id
      );

      if (found) {
        return {
          _id: id,
          id,
          ...found,
          isAvailable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      set.status = 404;
      return { error: "Product not found", code: "NOT_FOUND" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get single product by ID",
        tags: ["Catalog"],
      },
    }
  );

export const categoriesRoutes = new Elysia({ prefix: "/categories" })
  .get("/", getCategoriesHandler, categoriesSchema)
  .get("/index", getCategoriesHandler, categoriesSchema);
