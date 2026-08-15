"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, ShoppingBag, Sparkles, Check } from "lucide-react";
import { Button } from "@pizzaconstructor/ui";
import type { Product, SizePriceOption } from "@pizzaconstructor/shared";

import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, selectedSize: SizePriceOption, quantity: number) => void;
}

const DEFAULT_OPTION: SizePriceOption = { size: "Standard", price: 12.0, weightG: 500 };

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const addCatalogItem = useCartStore((state) => state.addCatalogItem);
  const sizes = product.sizePrices && product.sizePrices.length > 0
    ? product.sizePrices
    : [DEFAULT_OPTION];

  const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [addedAnimation, setAddedAnimation] = React.useState(false);

  const selectedOption: SizePriceOption = sizes[selectedSizeIndex] ?? sizes[0] ?? DEFAULT_OPTION;
  const unitPrice = selectedOption.price;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product, selectedOption, quantity);
    } else {
      addCatalogItem(product, selectedOption, quantity);
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const isPizza = product.category === "pizza" || product.category === "vegan";

  return (
    <div className="flex flex-col rounded-2xl bg-[#1a252f] border border-[#34495e]/60 overflow-hidden hover:border-[#f39c12]/60 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 group">
      {/* Tile Header / Image & Allergen Overlay */}
      <div className="relative w-full h-48 sm:h-52 bg-[#0f171e] overflow-hidden">
        <Image
          src={product.image || "/img/pizza_medium.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a252f] via-transparent to-transparent opacity-80" />

        {/* Allergen Badge Banner on Hover/Top */}
        {product.allergens && product.allergens.length > 0 && (
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex flex-wrap gap-1">
              {product.allergens.map((alg) => (
                <span
                  key={alg.name}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0f171e]/85 backdrop-blur-md text-[#e67e22] border border-[#f39c12]/40 shadow-sm"
                >
                  {alg.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#f39c12] text-[#0f171e]">
            {product.category}
          </span>
        </div>
      </div>

      {/* Tile Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#ecf0f1] font-display tracking-tight group-hover:text-[#f39c12] transition-colors">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-[#95a5a6] line-clamp-2 leading-relaxed">
            {product.description ||
              (product.ingredients && product.ingredients.length > 0
                ? product.ingredients.map((i) => i.name).join(", ")
                : "Handcrafted with fresh artisan ingredients.")}
          </p>
        </div>

        {/* Size Selection Radios */}
        {sizes.length > 1 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7f8c8d]">
              Select Size & Weight
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {sizes.map((option, idx) => {
                const isSelected = idx === selectedSizeIndex;
                return (
                  <button
                    key={option.size}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`py-1.5 px-1 rounded-lg text-center border transition-all ${
                      isSelected
                        ? "bg-[#f39c12]/15 border-[#f39c12] text-[#f39c12] shadow-sm shadow-[#f39c12]/20 font-bold"
                        : "bg-[#0f171e]/50 border-[#34495e]/60 text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#0f171e]"
                    }`}
                  >
                    <div className="text-[11px] leading-tight truncate">{option.size.split(" ")[0]}</div>
                    <div className="text-[10px] font-extrabold mt-0.5">${option.price.toFixed(2)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Quantity Controls */}
        <div className="pt-2 border-t border-[#34495e]/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7f8c8d] tracking-wider block">
              Total Price
            </span>
            <span className="text-xl font-extrabold text-[#f39c12] font-display">
              ${totalPrice}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-[#0f171e] rounded-lg p-1 border border-[#34495e]/60">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#34495e]/50 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-[#ecf0f1] px-1 min-w-4 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#34495e]/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            variant={addedAnimation ? "secondary" : "primary"}
            size="md"
            className="w-full flex items-center justify-center font-bold shadow-md shadow-[#f39c12]/20"
            onClick={handleAdd}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-[#27ae60]" />
                <span>Added to Basket!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                <span>Add to Basket (${totalPrice})</span>
              </>
            )}
          </Button>

          {isPizza && (
            <Link href="/constructor" className="block">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-[#95a5a6] hover:text-[#f39c12]"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#f39c12]" />
                <span>Customize in Pizza Builder</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
