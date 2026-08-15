import { describe, expect, it } from "bun:test";
import { app } from "../src/index";
import type { Product } from "@pizzaconstructor/shared";

interface ProductsResponse {
  items: Product[];
  total: number;
  category: string;
}

interface CategoryResponseItem {
  slug: string;
  title: string;
  description: string;
  activeIcon: string;
  inactiveIcon: string;
  count: number;
}

interface CategoriesResponse {
  categories: CategoryResponseItem[];
  totalCategories: number;
}

interface IngredientsResponse {
  ingredients: unknown[];
  grouped: {
    sauce: unknown[];
    cheese: unknown[];
    meat: unknown[];
    vegetable: unknown[];
    extra: unknown[];
  };
  total: number;
}

describe("Catalog API Routes", () => {
  it("GET /api/products returns catalog items", async () => {
    const res = await app.handle(new Request("http://localhost/api/products"));
    expect(res.status).toBe(200);

    const data = (await res.json()) as ProductsResponse;
    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.total).toBeGreaterThan(0);
  });

  it("GET /api/products?category=pizza filters by category", async () => {
    const res = await app.handle(new Request("http://localhost/api/products?category=pizza"));
    expect(res.status).toBe(200);

    const data = (await res.json()) as ProductsResponse;
    expect(data.category).toBe("pizza");
    expect(data.items.every((i) => i.category === "pizza")).toBe(true);
    expect(data.items.length).toBe(8);
  });

  it("GET /api/products?search=Margherita finds specific product", async () => {
    const res = await app.handle(new Request("http://localhost/api/products?search=Margherita"));
    expect(res.status).toBe(200);

    const data = (await res.json()) as ProductsResponse;
    expect(data.items.some((i) => i.name.includes("Margherita"))).toBe(true);
  });

  it("GET /api/categories returns all 5 categories with counts", async () => {
    const res = await app.handle(new Request("http://localhost/api/categories"));
    expect(res.status).toBe(200);

    const data = (await res.json()) as CategoriesResponse;
    expect(data.categories).toBeDefined();
    expect(data.categories.length).toBe(5);
    const slugs = data.categories.map((c) => c.slug);
    expect(slugs).toContain("pizza");
    expect(slugs).toContain("salad");
    expect(slugs).toContain("desert");
    expect(slugs).toContain("beverages");
    expect(slugs).toContain("vegan");
  });

  it("GET /api/ingredients returns grouped ingredients for constructor", async () => {
    const res = await app.handle(new Request("http://localhost/api/ingredients"));
    expect(res.status).toBe(200);

    const data = (await res.json()) as IngredientsResponse;
    expect(data.ingredients).toBeDefined();
    expect(data.grouped.sauce.length).toBeGreaterThan(0);
    expect(data.grouped.cheese.length).toBeGreaterThan(0);
    expect(data.grouped.meat.length).toBeGreaterThan(0);
    expect(data.grouped.vegetable.length).toBeGreaterThan(0);
  });
});
