"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CreditCard,
  Banknote,
  Sparkles,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@pizzaconstructor/ui";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const {
    items,
    promoCode,
    discountPercent,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  const [mounted, setMounted] = React.useState(false);
  const [promoInput, setPromoInput] = React.useState("");
  const [promoMessage, setPromoMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "cash">("card");
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full flex items-center justify-center">
        <div className="text-sm text-[#95a5a6]">Loading your basket...</div>
      </main>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryFee();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoMessage({ text: "Promo code applied successfully!", type: "success" });
    } else {
      setPromoMessage({ text: "Invalid promo code (Try PIZZA10 or FREESHIP)", type: "error" });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const newOrderId = `PC-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#27ae60]/20 border-2 border-[#27ae60] flex items-center justify-center text-[#27ae60] mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-[#27ae60]/15 text-[#27ae60] border border-[#27ae60]/30 mb-2">
          Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ecf0f1] font-display">
          Thank you, <span className="text-[#f39c12]">{fullName || "Foodie"}</span>!
        </h1>

        <p className="text-sm text-[#95a5a6] mt-2 max-w-md">
          Your artisanal order has been sent directly to the kitchen. Our pizzaiolos are preparing your fresh dough now.
        </p>

        {/* Order Details Card */}
        <div className="w-full mt-8 bg-[#1a252f] border border-[#34495e]/80 rounded-3xl p-6 text-left space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#34495e]/60 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7f8c8d] block">
                Order Tracking ID
              </span>
              <span className="text-base font-extrabold font-mono text-[#f39c12]">
                #{orderId}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-[#27ae60] bg-[#27ae60]/10 px-3 py-1 rounded-full border border-[#27ae60]/30">
              <Clock className="w-3.5 h-3.5" />
              <span>Estimated Delivery: 25-35 mins</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#7f8c8d] block font-bold">Delivery Address:</span>
              <span className="text-[#ecf0f1] font-medium">{address || "Artisan City Center"}</span>
            </div>
            <div>
              <span className="text-[#7f8c8d] block font-bold">Contact Phone:</span>
              <span className="text-[#ecf0f1] font-medium">{phone || "+1 (555) 123-4567"}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
          <Link href="/menu" className="w-full">
            <Button variant="primary" size="md" className="w-full font-bold">
              Order More Items
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" size="md" className="w-full text-xs">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
      {/* Header */}
      <div className="pb-6 border-b border-[#34495e]/60">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ecf0f1] font-display tracking-tight">
          Shopping <span className="text-[#f39c12]">Cart</span> & Checkout
        </h1>
        <p className="text-sm text-[#95a5a6] mt-1">
          Review your chosen dishes, apply promotional vouchers, and enter your delivery destination.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#1a252f] border border-[#34495e] flex items-center justify-center text-3xl">
            🛒
          </div>
          <h2 className="text-xl font-bold text-[#ecf0f1]">
            Your shopping basket is currently empty
          </h2>
          <p className="text-sm text-[#95a5a6] max-w-md">
            Looks like you haven&apos;t added any items to your order yet. Check out our menu or build a custom recipe!
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <Link href="/menu">
              <Button variant="primary" size="md" className="font-bold">
                Browse Menu
              </Button>
            </Link>
            <Link href="/constructor">
              <Button variant="outline" size="md" className="text-xs">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#f39c12]" />
                <span>Build Pizza</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#ecf0f1] font-display">
                Your Items ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-[#7f8c8d] hover:text-[#e74c3c] transition-colors"
              >
                Clear Entire Basket
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1a252f] border border-[#34495e]/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-[#f39c12]/50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-xl bg-[#0f171e] overflow-hidden shrink-0 border border-[#34495e]">
                      <Image
                        src={item.image || "/img/pizza_medium.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#ecf0f1] font-display">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-[#7f8c8d] mt-0.5">
                        <span className="font-semibold text-[#f39c12]">{item.sizeLabel}</span>
                        <span>•</span>
                        <span>{item.weightG}g</span>
                      </div>

                      {/* Custom Pizza Ingredients snapshot */}
                      {item.customDetails && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0f171e] text-[#ecf0f1] border border-[#34495e]">
                            {item.customDetails.dough.replace("_", " ")}
                          </span>
                          {item.customDetails.sauces.map((s) => (
                            <span
                              key={s.ingredient.id}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-[#0f171e] text-[#f39c12] border border-[#f39c12]/30"
                            >
                              {s.ingredient.name.split(" ")[0]}
                            </span>
                          ))}
                          {item.customDetails.toppings.map((t) => (
                            <span
                              key={t.ingredient.id}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-[#0f171e] text-[#f39c12] border border-[#f39c12]/30"
                            >
                              {t.ingredient.name.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#34495e]/40">
                    <div className="flex items-center space-x-2 bg-[#0f171e] rounded-xl p-1 border border-[#34495e]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#34495e]/50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-[#ecf0f1] px-1.5 min-w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#34495e]/50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#f39c12] font-mono block">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#7f8c8d]">
                        ${item.unitPrice.toFixed(2)} each
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[#7f8c8d] hover:text-[#e74c3c] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="bg-[#1a252f] border border-[#34495e]/70 rounded-2xl p-4 shadow-lg">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f8c8d]" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter Promo Code (e.g. PIZZA10)"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f171e] border border-[#34495e] text-xs font-semibold text-[#ecf0f1] uppercase placeholder:normal-case placeholder-[#7f8c8d] focus:outline-none focus:border-[#f39c12]"
                  />
                </div>
                <Button type="submit" variant="outline" size="sm" className="text-xs font-bold shrink-0">
                  Apply Code
                </Button>
              </form>
              {promoMessage && (
                <p
                  className={`text-xs mt-2 font-medium ${
                    promoMessage.type === "success" ? "text-[#27ae60]" : "text-[#e74c3c]"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
              {promoCode && (
                <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#27ae60]/15 text-[#27ae60] text-xs font-bold border border-[#27ae60]/30">
                  <span>Active Voucher: {promoCode} ({discountPercent}% OFF)</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Details & Summary */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handlePlaceOrder} className="bg-[#1a252f] border border-[#34495e]/80 rounded-3xl p-6 shadow-2xl space-y-5">
              <h3 className="text-lg font-bold text-[#ecf0f1] font-display border-b border-[#34495e]/60 pb-3">
                Delivery & Contact Info
              </h3>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7f8c8d] flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Silver"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0f171e] border border-[#34495e] text-xs font-medium text-[#ecf0f1] focus:outline-none focus:border-[#f39c12]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7f8c8d] flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-1234"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0f171e] border border-[#34495e] text-xs font-medium text-[#ecf0f1] focus:outline-none focus:border-[#f39c12]"
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7f8c8d] flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Street Address & Apartment</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Artisan Ave, Suite 4B"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0f171e] border border-[#34495e] text-xs font-medium text-[#ecf0f1] focus:outline-none focus:border-[#f39c12]"
                />
              </div>

              {/* Order Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7f8c8d]">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ring doorbell, leave on porch..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0f171e] border border-[#34495e] text-xs font-medium text-[#ecf0f1] focus:outline-none focus:border-[#f39c12]"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5 pt-2 border-t border-[#34495e]/50">
                <label className="text-xs font-bold text-[#7f8c8d] block">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      paymentMethod === "card"
                        ? "bg-[#f39c12]/15 border-[#f39c12] text-[#f39c12]"
                        : "bg-[#0f171e] border-[#34495e] text-[#95a5a6]"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      paymentMethod === "cash"
                        ? "bg-[#f39c12]/15 border-[#f39c12] text-[#f39c12]"
                        : "bg-[#0f171e] border-[#34495e] text-[#95a5a6]"
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Order Total Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#34495e]/60 text-xs">
                <div className="flex items-center justify-between text-[#95a5a6]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#ecf0f1]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-[#27ae60]">
                    <span>Discount ({discountPercent}%)</span>
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
                  <span className="text-[#ecf0f1]">Final Total</span>
                  <span className="text-2xl font-extrabold text-[#f39c12] font-display">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center font-extrabold text-sm shadow-xl shadow-[#f39c12]/20"
              >
                <span>Place Order (${total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#7f8c8d] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#27ae60]" />
                <span>Encrypted 256-bit SSL Checkout</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
