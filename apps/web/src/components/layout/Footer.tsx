import * as React from "react";
import Link from "next/link";
import { Pizza, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#34495e]/50 bg-[#0f171e] text-[#95a5a6] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2">
            <Pizza className="w-6 h-6 text-[#f39c12]" />
            <span className="text-lg font-bold text-[#ecf0f1]">PizzaConstructor</span>
          </div>
          <p className="text-sm text-[#7f8c8d] max-w-sm">
            Craft custom pizzas with dynamic allergen & weight tracking, or start real-time collaborative group orders with your team.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#ecf0f1] mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/menu" className="hover:text-[#f39c12] transition-colors">
                Menu & Categories
              </Link>
            </li>
            <li>
              <Link href="/constructor" className="hover:text-[#f39c12] transition-colors">
                Custom Pizza Builder
              </Link>
            </li>
            <li>
              <Link href="/group-order" className="hover:text-[#f39c12] transition-colors">
                Collaborative Group Orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#ecf0f1] mb-3">
            Architecture
          </h4>
          <p className="text-xs text-[#7f8c8d] leading-relaxed">
            Turborepo + Bun + Next.js 15 App Router + ElysiaJS + Eden Treaty RPC.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-[#1a252f] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7f8c8d]">
        <p>© {new Date().getFullYear()} PizzaConstructor. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#e74c3c] fill-current" />
          <span>for pizza lovers</span>
        </p>
      </div>
    </footer>
  );
};
