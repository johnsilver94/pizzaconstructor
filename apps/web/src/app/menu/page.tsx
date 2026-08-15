"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Sparkles, RefreshCw, Layers } from "lucide-react";
import { CategorySidebar } from "@/components/menu/CategorySidebar";
import { ProductCard } from "@/components/menu/ProductCard";
import { api } from "@/lib/eden";
import type { Product, SizePriceOption } from "@pizzaconstructor/shared";

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("category") || "pizza";
  const [activeCategory, setActiveCategory] = React.useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categoryCounts, setCategoryCounts] = React.useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Load category definitions & counts
  React.useEffect(() => {
    api.categories.index
      .get()
      .then((res) => {
        if (res.data && res.data.categories) {
          const counts: Record<string, number> = {};
          for (const c of res.data.categories) {
            counts[c.slug] = c.count;
          }
          setCategoryCounts(counts);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch category counts:", err);
      });
  }, []);

  // Fetch products whenever category or search changes
  React.useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    const query: Record<string, string> = {};
    if (activeCategory && activeCategory !== "all") {
      query.category = activeCategory;
    }
    if (searchTerm.trim().length > 0) {
      query.search = searchTerm.trim();
    }

    api.products.index
      .get({
        $query: query,
      })
      .then((res) => {
        if (isCurrent && res.data && res.data.items) {
          setProducts(res.data.items as Product[]);
        }
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeCategory, searchTerm]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    router.push(`/menu?category=${slug}`, { scroll: false });
  };

  const handleAddToCart = (product: Product, size: SizePriceOption, qty: number) => {
    console.log("Added to cart:", { product: product.name, size: size.size, price: size.price, qty });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#34495e]/60">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f39c12]/15 border border-[#f39c12]/30 text-[#f39c12] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Kitchen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ecf0f1] font-display tracking-tight">
            Menu <span className="text-[#f39c12]">Catalog</span>
          </h1>
          <p className="text-sm text-[#95a5a6] mt-1">
            Choose from freshly prepared pizzas, crisp salads, decadent desserts, beverages, or vegan dishes.
          </p>
        </div>

        {/* Search Filter Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f8c8d]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pizza, ingredients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a252f] border border-[#34495e]/80 text-sm text-[#ecf0f1] placeholder-[#7f8c8d] focus:outline-none focus:border-[#f39c12] focus:ring-1 focus:ring-[#f39c12] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7f8c8d] hover:text-[#ecf0f1]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Category Sidebar + Product Cards */}
      <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Category Selector */}
        <CategorySidebar
          activeCategory={activeCategory}
          categoryCounts={categoryCounts}
          onSelectCategory={handleCategorySelect}
        />

        {/* Right Product Grid */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <RefreshCw className="w-8 h-8 text-[#f39c12] animate-spin" />
              <p className="text-sm text-[#95a5a6]">Loading fresh catalog items...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-[#1a252f]/40 border border-[#34495e]/40 p-8">
              <Layers className="w-12 h-12 text-[#7f8c8d] mb-3" />
              <h3 className="text-lg font-bold text-[#ecf0f1]">No items found</h3>
              <p className="text-sm text-[#95a5a6] mt-1 max-w-sm">
                We couldn&apos;t find any products matching your current category and search query.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("pizza");
                  setSearchTerm("");
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#f39c12] text-[#0f171e] font-bold text-xs hover:bg-[#e67e22] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id || product.name}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function MenuPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-32">
          <RefreshCw className="w-8 h-8 text-[#f39c12] animate-spin" />
        </div>
      }
    >
      <MenuContent />
    </React.Suspense>
  );
}
