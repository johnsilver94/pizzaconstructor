"use client";

import * as React from "react";
import { ShoppingBag, Users, RotateCcw, AlertTriangle, Sparkles, Scale, Flame } from "lucide-react";
import { Button } from "@pizzaconstructor/ui";
import type { CalculatedPizzaMetrics } from "@pizzaconstructor/shared";

import { useCartStore } from "@/store/useCartStore";

interface LiveSummaryPanelProps {
  metrics: CalculatedPizzaMetrics;
  recipeName: string;
  onAddToCart: () => void;
  onAddToGroupOrder?: () => void;
  onReset: () => void;
}

export const LiveSummaryPanel: React.FC<LiveSummaryPanelProps> = ({
  metrics,
  recipeName,
  onAddToCart,
  onAddToGroupOrder,
  onReset,
}) => {
  const [addedAnimation, setAddedAnimation] = React.useState(false);

  const handleAdd = () => {
    onAddToCart();
    useCartStore.getState().openDrawer();
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  return (
    <div className="bg-[#1a252f] border border-[#34495e]/80 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#34495e]/60 pb-3">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#f39c12] block">
            Recipe Summary
          </span>
          <h3 className="text-base font-bold text-[#ecf0f1] font-display truncate max-w-[220px]">
            {recipeName}
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#7f8c8d] hover:text-[#e74c3c] flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Metrics Row: Price, Weight, Calories */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0f171e] p-3 rounded-xl border border-[#34495e]/50 text-center">
          <span className="text-[10px] font-bold text-[#7f8c8d] uppercase tracking-wider block">
            Total Price
          </span>
          <span className="text-xl font-extrabold text-[#f39c12] font-display">
            ${metrics.totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#0f171e] p-3 rounded-xl border border-[#34495e]/50 text-center">
          <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-[#7f8c8d] uppercase tracking-wider">
            <Scale className="w-3 h-3 text-[#3498db]" />
            <span>Weight</span>
          </div>
          <span className="text-lg font-extrabold text-[#ecf0f1] font-display mt-0.5 block">
            {metrics.totalWeightG}g
          </span>
        </div>

        <div className="bg-[#0f171e] p-3 rounded-xl border border-[#34495e]/50 text-center">
          <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-[#7f8c8d] uppercase tracking-wider">
            <Flame className="w-3 h-3 text-[#e67e22]" />
            <span>Calories</span>
          </div>
          <span className="text-lg font-extrabold text-[#ecf0f1] font-display mt-0.5 block">
            {metrics.totalCaloriesKcal}
          </span>
        </div>
      </div>

      {/* Allergens Notification */}
      <div className="bg-[#0f171e] p-3 rounded-xl border border-[#34495e]/60 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#e67e22]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Allergen Profile ({metrics.allergens.length})</span>
        </div>
        {metrics.allergens.length === 0 ? (
          <p className="text-[11px] text-[#27ae60]">
            No major allergens detected in this custom combination.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {metrics.allergens.map((alg) => (
              <span
                key={alg}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1a252f] text-[#f39c12] border border-[#f39c12]/30"
              >
                {alg}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <Button
          variant={addedAnimation ? "secondary" : "primary"}
          size="lg"
          className="w-full flex items-center justify-center font-bold shadow-lg shadow-[#f39c12]/20 text-sm"
          onClick={handleAdd}
        >
          {addedAnimation ? (
            <>
              <Sparkles className="w-4 h-4 mr-1.5 text-[#27ae60]" />
              <span>Added to Cart (${metrics.totalPrice.toFixed(2)})!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              <span>Add Custom Pizza (${metrics.totalPrice.toFixed(2)})</span>
            </>
          )}
        </Button>

        {onAddToGroupOrder && (
          <Button
            variant="outline"
            size="md"
            className="w-full flex items-center justify-center text-xs text-[#3498db] border-[#3498db]/40 hover:bg-[#3498db]/15"
            onClick={onAddToGroupOrder}
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            <span>Add to Group Order Session</span>
          </Button>
        )}
      </div>
    </div>
  );
};
