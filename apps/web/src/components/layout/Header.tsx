"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { ShoppingBag, Pizza } from "lucide-react";
import { api } from "@/lib/eden";
import { useCartStore } from "@/store/useCartStore";

export const Header: React.FC = () => {
  const [apiOnline, setApiOnline] = React.useState<boolean | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const { items, openDrawer } = useCartStore();

  React.useEffect(() => {
    setMounted(true);
    let isMounted = true;
    api.health.index
      .get()
      .then((res) => {
        if (isMounted) {
          setApiOnline(res.status === 200);
        }
      })
      .catch(() => {
        if (isMounted) setApiOnline(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalItemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#34495e]/60 bg-[#0f171e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f39c12] to-[#e67e22] flex items-center justify-center shadow-lg shadow-[#f39c12]/20 group-hover:scale-105 transition-transform">
            <Pizza className="w-6 h-6 text-[#0f171e]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#ecf0f1] font-display">
              Pizza<span className="text-[#f39c12]">Constructor</span>
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-[#7f8c8d]">
              <span
                className={`w-2 h-2 rounded-full inline-block ${
                  apiOnline === true
                    ? "bg-[#27ae60] shadow-[0_0_8px_#27ae60]"
                    : apiOnline === false
                    ? "bg-[#e74c3c]"
                    : "bg-[#f39c12] animate-pulse"
                }`}
              />
              <span>{apiOnline ? "API Online" : "Eden Ready"}</span>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <Navbar />

        {/* Quick Actions / Cart Drawer Trigger */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={openDrawer}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#1a252f] hover:bg-[#2c3e50] text-[#ecf0f1] border border-[#34495e] hover:border-[#f39c12]/50 transition-all cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-[#f39c12]" />
            <span className="text-sm font-bold">Basket</span>
            <span className="text-xs bg-[#f39c12] text-[#0f171e] font-extrabold px-2 py-0.5 rounded-full">
              {totalItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
