"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, Users, Sparkles } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const navItems: NavItem[] = [
  { label: "Menu Catalog", href: "/menu", icon: UtensilsCrossed },
  { label: "Pizza Builder", href: "/constructor", icon: Sparkles, badge: "New" },
  { label: "Group Orders", href: "/group-order", icon: Users },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-[#f39c12]/15 text-[#f39c12] border border-[#f39c12]/30"
                : "text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
            {item.badge ? (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#f39c12] text-[#0f171e]">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
};
