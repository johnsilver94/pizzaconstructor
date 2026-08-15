"use client";

import * as React from "react";
import type { Ingredient, PortionPlacement } from "@pizzaconstructor/shared";

interface IngredientCardProps {
  ingredient: Ingredient;
  currentPortion: PortionPlacement | "none";
  onSelectPortion: (ingredient: Ingredient, portion: PortionPlacement | "none") => void;
  sizeMultiplier?: number;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  currentPortion,
  onSelectPortion,
  sizeMultiplier = 1.0,
}) => {
  const isSelected = currentPortion !== "none";
  const adjustedPrice = (ingredient.price * sizeMultiplier).toFixed(2);
  const adjustedWeight = Math.round(ingredient.weightG * sizeMultiplier);
  const adjustedCalories = Math.round(ingredient.caloriesKcal * sizeMultiplier);

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
        isSelected
          ? "bg-[#1a252f] border-[#f39c12] shadow-lg shadow-[#f39c12]/15"
          : "bg-[#1a252f]/60 border-[#34495e]/60 hover:border-[#f39c12]/40 hover:bg-[#1a252f]"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-[#34495e]"
            style={{ backgroundColor: ingredient.colorHex ? `${ingredient.colorHex}22` : "#0f171e" }}
          >
            <span>{ingredient.icon || "🍕"}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#ecf0f1] font-display">
              {ingredient.name}
            </h4>
            <div className="flex items-center space-x-2 text-[11px] text-[#7f8c8d] mt-0.5">
              <span>{adjustedWeight}g</span>
              <span>•</span>
              <span>{adjustedCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* Price Tag */}
        <div className="text-right">
          <span className="text-xs font-extrabold text-[#f39c12]">
            +${adjustedPrice}
          </span>
        </div>
      </div>

      {/* Allergens badges (if any) */}
      {ingredient.allergens && ingredient.allergens.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {ingredient.allergens.map((alg) => (
            <span
              key={alg}
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0f171e] text-[#e67e22] border border-[#f39c12]/30"
            >
              {alg}
            </span>
          ))}
        </div>
      )}

      {/* Portion Selector Radio Buttons */}
      <div className="pt-2 border-t border-[#34495e]/50">
        <span className="text-[10px] uppercase font-bold text-[#7f8c8d] tracking-wider block mb-1.5">
          Portion
        </span>
        <div className="grid grid-cols-5 gap-1 text-[10px] font-semibold">
          {[
            { id: "none" as const, label: "Off" },
            { id: "full" as const, label: "Full" },
            { id: "left" as const, label: "Left" },
            { id: "right" as const, label: "Right" },
            { id: "double" as const, label: "2x" },
          ].map((opt) => {
            const isActive = currentPortion === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectPortion(ingredient, opt.id)}
                className={`py-1 rounded-md border text-center transition-all ${
                  isActive
                    ? "bg-[#f39c12] text-[#0f171e] font-extrabold border-[#f39c12] shadow-sm"
                    : "bg-[#0f171e]/60 border-[#34495e]/60 text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#0f171e]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
