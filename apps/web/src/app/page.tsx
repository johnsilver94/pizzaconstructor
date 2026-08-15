import * as React from "react";
import Link from "next/link";
import { Sparkles, Users, UtensilsCrossed, ArrowRight, Zap, Layers } from "lucide-react";
import { Button } from "@pizzaconstructor/ui";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#f39c12]/10 border border-[#f39c12]/30 mb-6 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-[#f39c12]" />
          <span className="text-xs uppercase font-bold tracking-wider text-[#f39c12]">
            Modernized Next.js 15 + Bun Architecture
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#ecf0f1] font-display max-w-4xl leading-tight">
          Craft Your Perfect Pizza. <br />
          <span className="bg-gradient-to-r from-[#f39c12] via-[#e67e22] to-[#f5d76e] bg-clip-text text-transparent">
            Order Together in Real-Time.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#95a5a6] max-w-2xl leading-relaxed">
          Interactive layer-by-layer pizza constructor with instant price, weight, and allergen calculation. Organize collaborative group orders with colleagues with one click.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/constructor">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-[#f39c12]/25">
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Launch Pizza Builder</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/group-order">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Users className="w-5 h-5 mr-2 text-[#f39c12]" />
              <span>Start Group Order</span>
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              <span>Explore Menu</span>
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Card 1: Interactive Pizza Builder */}
          <div className="p-6 rounded-2xl bg-[#1a252f]/70 border border-[#34495e]/60 hover:border-[#f39c12]/50 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#f39c12]/15 border border-[#f39c12]/30 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-[#f39c12]" />
            </div>
            <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
              Visual Pizza Canvas
            </h3>
            <p className="mt-2 text-sm text-[#95a5a6] leading-relaxed">
              Step-by-step dough selection, sauces, premium cheeses, and layered toppings with instant nutritional and allergen calculation.
            </p>
          </div>

          {/* Card 2: Real-time Group Ordering */}
          <div className="p-6 rounded-2xl bg-[#1a252f]/70 border border-[#34495e]/60 hover:border-[#f39c12]/50 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#f39c12]/15 border border-[#f39c12]/30 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#f39c12]" />
            </div>
            <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
              Collaborative Order Rooms
            </h3>
            <p className="mt-2 text-sm text-[#95a5a6] leading-relaxed">
              Create an order session, share the invite code with teammates, sync carts over WebSockets, and check out together.
            </p>
          </div>

          {/* Card 3: High-Performance Architecture */}
          <div className="p-6 rounded-2xl bg-[#1a252f]/70 border border-[#34495e]/60 hover:border-[#f39c12]/50 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#f39c12]/15 border border-[#f39c12]/30 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[#f39c12]" />
            </div>
            <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
              Eden Treaty Type Safety
            </h3>
            <p className="mt-2 text-sm text-[#95a5a6] leading-relaxed">
              Zero-codegen RPC bridge connecting Next.js 15 App Router directly to ElysiaJS on Bun runtime with end-to-end type safety.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
