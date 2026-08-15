"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Users, ArrowRight, Layers, ChevronRight } from "lucide-react";
import { Button } from "@pizzaconstructor/ui";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCard } from "@/components/menu/ProductCard";
import { CATEGORIES } from "@/components/menu/CategorySidebar";
import { api } from "@/lib/eden";
import type { Product } from "@pizzaconstructor/shared";

export default function HomePage() {
  const [featuredPizzas, setFeaturedPizzas] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isCurrent = true;
    api.products.index
      .get({
        $query: { category: "pizza", limit: 6 },
      })
      .then((res) => {
        if (isCurrent && res.data && res.data.items) {
          setFeaturedPizzas(res.data.items as Product[]);
        }
      })
      .catch((err) => {
        console.warn("Could not load featured pizzas:", err);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center">
      {/* Top Hero Carousel Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <HeroCarousel />
      </section>

      {/* Quick Category Jump Bar */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#ecf0f1] font-display">
            Explore Categories
          </h2>
          <Link
            href="/menu"
            className="text-xs font-bold text-[#f39c12] hover:text-[#e67e22] flex items-center"
          >
            <span>View All Menu</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/menu/${cat.slug}`}
              className="flex items-center space-x-3 p-4 rounded-2xl bg-[#1a252f]/70 border border-[#34495e]/60 hover:border-[#f39c12] hover:bg-[#1a252f] hover:scale-102 transition-all shadow-md group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0f171e] p-2 flex items-center justify-center border border-[#34495e]/50">
                <img
                  src={cat.activeIcon}
                  alt={cat.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-sm font-bold text-[#ecf0f1] group-hover:text-[#f39c12] transition-colors">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Pizzas Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f39c12]/15 border border-[#f39c12]/30 text-[#f39c12] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef&apos;s Specials</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#ecf0f1] font-display">
              Popular Handcrafted Pizzas
            </h2>
            <p className="text-sm text-[#95a5a6] mt-1">
              Select your favorite size and ingredients, or jump straight into the visual constructor.
            </p>
          </div>

          <Link href="/menu/pizza">
            <Button variant="outline" size="md">
              <span>View All 8 Pizzas</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-[#95a5a6]">Loading popular pizzas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPizzas.map((pizza) => (
              <ProductCard key={pizza._id || pizza.id || pizza.name} product={pizza} />
            ))}
          </div>
        )}
      </section>

      {/* Visual Constructor & Collaborative Orders Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Constructor Promo Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a252f] to-[#0f171e] border border-[#f39c12]/40 shadow-xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#f39c12]/20 border border-[#f39c12]/40 flex items-center justify-center">
              <Layers className="w-6 h-6 text-[#f39c12]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#ecf0f1] font-display">
              Interactive Pizza Constructor
            </h3>
            <p className="text-sm text-[#95a5a6] leading-relaxed">
              Design a unique recipe from scratch. Customize crust type, fresh sauces, cheese blends, and layered toppings with instant nutritional and allergen tracking.
            </p>
            <div className="pt-2">
              <Link href="/constructor">
                <Button variant="primary" size="md" className="shadow-lg shadow-[#f39c12]/25">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Launch Visual Builder</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Group Orders Promo Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a252f] to-[#0f171e] border border-[#34495e]/80 shadow-xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#34495e]/40 border border-[#34495e] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#f39c12]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#ecf0f1] font-display">
              Collaborative Group Orders
            </h3>
            <p className="text-sm text-[#95a5a6] leading-relaxed">
              Hosting a party or office lunch? Create a real-time order session, share the invite code with your team, and place a single combined order with zero confusion.
            </p>
            <div className="pt-2">
              <Link href="/group-order">
                <Button variant="secondary" size="md">
                  <Users className="w-4 h-4 mr-2 text-[#f39c12]" />
                  <span>Host Group Room</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
