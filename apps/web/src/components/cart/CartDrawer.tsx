"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@pizzaconstructor/ui";
import { useCartStore } from "@/store/useCartStore";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryFee();
  const total = getTotal();

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isDrawerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex w-full sm:w-[420px] bg-[#1a252f] border-l border-[#34495e]/80 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-1 flex flex-col justify-between h-full overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-[#34495e]/60 flex items-center justify-between bg-[#0f171e]/60">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#f39c12]" />
              <h2 className="text-lg font-bold text-[#ecf0f1] font-display">
                Your Basket
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#f39c12]/20 text-[#f39c12]">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#34495e]/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#0f171e] border border-[#34495e]/60 flex items-center justify-center text-2xl">
                  🍕
                </div>
                <h3 className="text-base font-bold text-[#ecf0f1]">
                  Your basket is empty
                </h3>
                <p className="text-xs text-[#95a5a6] max-w-xs">
                  Browse our artisanal menu or craft a custom pizza with your favorite toppings.
                </p>
                <div className="pt-2 flex flex-col space-y-2 w-full max-w-xs">
                  <Link href="/menu" onClick={closeDrawer}>
                    <Button variant="primary" size="sm" className="w-full font-bold">
                      Explore Menu
                    </Button>
                  </Link>
                  <Link href="/constructor" onClick={closeDrawer}>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-[#f39c12]" />
                      <span>Pizza Constructor</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0f171e]/70 border border-[#34495e]/60 rounded-2xl p-3.5 flex flex-col space-y-3 transition-all hover:border-[#f39c12]/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative w-14 h-14 rounded-xl bg-[#1a252f] overflow-hidden shrink-0 border border-[#34495e]">
                      <Image
                        src={item.image || "/img/pizza_medium.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#ecf0f1] font-display truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-[#7f8c8d] mt-0.5">
                        <span className="font-semibold text-[#f39c12]">{item.sizeLabel}</span>
                        <span>•</span>
                        <span>{item.weightG}g</span>
                      </div>

                      {/* Custom Pizza Recipe details */}
                      {item.customDetails && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {item.customDetails.sauces.map((s) => (
                            <span
                              key={s.ingredient.id}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-[#1a252f] text-[#ecf0f1] border border-[#34495e]"
                            >
                              {s.ingredient.name.split(" ")[0]}
                            </span>
                          ))}
                          {item.customDetails.toppings.map((t) => (
                            <span
                              key={t.ingredient.id}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-[#1a252f] text-[#f39c12] border border-[#f39c12]/30"
                            >
                              {t.ingredient.name.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[#7f8c8d] hover:text-[#e74c3c] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="pt-2 border-t border-[#34495e]/40 flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-[#1a252f] rounded-lg p-1 border border-[#34495e]/60">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#34495e]/50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#ecf0f1] px-1 min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#34495e]/50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-[#f39c12] font-mono">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#34495e]/60 bg-[#0f171e]/90 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#95a5a6]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#ecf0f1]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-[#27ae60]">
                    <span>Promo Discount</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#95a5a6]">
                  <span>Delivery Fee</span>
                  <span className="font-mono">
                    {delivery === 0 ? (
                      <span className="text-[#27ae60] font-bold">FREE</span>
                    ) : (
                      `$${delivery.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#34495e]/60 flex items-center justify-between font-bold text-sm">
                  <span className="text-[#ecf0f1]">Estimated Total</span>
                  <span className="text-xl font-extrabold text-[#f39c12] font-display">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link href="/cart" onClick={closeDrawer} className="block">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center font-extrabold text-sm shadow-xl shadow-[#f39c12]/20"
                  >
                    <span>Proceed to Checkout (${total.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#7f8c8d] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#27ae60]" />
                  <span>Secure 100% Artisan Guarantee</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
