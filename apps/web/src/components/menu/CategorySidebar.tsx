"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategorySlug } from "@pizzaconstructor/shared";

export interface CategoryItem {
  slug: CategorySlug | "all";
  title: string;
  count?: number;
  activeIcon: string;
  inactiveIcon: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    slug: "pizza",
    title: "Pizza",
    activeIcon: "/img/categories/pizza_color.svg",
    inactiveIcon: "/img/categories/food.svg",
  },
  {
    slug: "salad",
    title: "Salads",
    activeIcon: "/img/categories/salad_color.svg",
    inactiveIcon: "/img/categories/fork.svg",
  },
  {
    slug: "desert",
    title: "Desserts",
    activeIcon: "/img/categories/cupcake_color.svg",
    inactiveIcon: "/img/categories/icecream.svg",
  },
  {
    slug: "beverages",
    title: "Beverages",
    activeIcon: "/img/categories/cocktail_color.svg",
    inactiveIcon: "/img/categories/cocktail.svg",
  },
  {
    slug: "vegan",
    title: "Vegan",
    activeIcon: "/img/categories/veganfork_color.svg",
    inactiveIcon: "/img/categories/vegan.svg",
  },
];

interface CategorySidebarProps {
  activeCategory: string;
  categoryCounts?: Record<string, number>;
  onSelectCategory?: (slug: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  activeCategory,
  categoryCounts = {},
  onSelectCategory,
}) => {
  return (
    <aside className="w-full lg:w-44 flex lg:flex-col gap-3.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:sticky lg:top-24 select-none">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.slug;
        const iconSrc = isActive ? cat.activeIcon : cat.inactiveIcon;
        const count = categoryCounts[cat.slug];

        return (
          <Link
            key={cat.slug}
            href={`/menu/${cat.slug}`}
            onClick={(e) => {
              if (onSelectCategory) {
                e.preventDefault();
                onSelectCategory(cat.slug);
              }
            }}
            className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 group cursor-pointer ${
              isActive
                ? "bg-[#1a252f] border-[#f39c12] shadow-lg shadow-[#f39c12]/20 scale-105"
                : "bg-[#1a252f]/60 border-[#34495e]/60 hover:border-[#f39c12]/50 hover:bg-[#1a252f] hover:scale-102"
            } w-28 h-28 sm:w-32 sm:h-32 lg:w-full lg:h-32`}
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-2 flex items-center justify-center">
              <Image
                src={iconSrc}
                alt={cat.title}
                width={56}
                height={56}
                className={`transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "filter-none drop-shadow-[0_2px_8px_rgba(243,156,18,0.4)]" : "opacity-80"
                }`}
              />
            </div>

            <span
              className={`text-sm font-bold tracking-tight ${
                isActive ? "text-[#f39c12]" : "text-[#ecf0f1] group-hover:text-[#f39c12]"
              }`}
            >
              {cat.title}
            </span>

            {count !== undefined && count > 0 && (
              <span className="text-[10px] text-[#7f8c8d] font-semibold mt-0.5">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </Link>
        );
      })}
    </aside>
  );
};
