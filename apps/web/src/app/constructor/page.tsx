"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Scissors,
  CheckCircle2,
  ChefHat,
} from "lucide-react";
import { Button, PizzaCanvas } from "@pizzaconstructor/ui";
import {
  PIZZA_SIZE_CONFIGS,
  DOUGH_TYPE_CONFIGS,
  type PizzaSizeId,
  type DoughTypeId,
  type Ingredient,
  type PortionPlacement,
  type SelectedTopping,
} from "@pizzaconstructor/shared";
import { usePizzaBuilderStore } from "@/store/usePizzaBuilderStore";
import { StepWizardNav, WIZARD_STEPS } from "@/components/constructor/StepWizardNav";
import { IngredientCard } from "@/components/constructor/IngredientCard";
import { LiveSummaryPanel } from "@/components/constructor/LiveSummaryPanel";
import { api } from "@/lib/eden";

import { useCartStore } from "@/store/useCartStore";

const FALLBACK_INGREDIENTS: Ingredient[] = [
  // Sauces
  { id: "sauce-tomato", name: "San Marzano Tomato Sauce", category: "sauce", price: 1.5, weightG: 80, caloriesKcal: 45, allergens: [], icon: "🍅" },
  { id: "sauce-creamy-garlic", name: "Creamy Garlic White Sauce", category: "sauce", price: 1.8, weightG: 80, caloriesKcal: 110, allergens: ["Lactose"], icon: "🧄" },
  { id: "sauce-pesto", name: "Genovese Basil Pesto", category: "sauce", price: 2.2, weightG: 70, caloriesKcal: 140, allergens: ["Nuts", "Lactose"], icon: "🌿" },
  { id: "sauce-bbq", name: "Smoky Bourbon BBQ Sauce", category: "sauce", price: 1.8, weightG: 80, caloriesKcal: 85, allergens: [], icon: "🪵" },

  // Cheeses
  { id: "cheese-mozzarella", name: "Fior di Latte Mozzarella", category: "cheese", price: 2.5, weightG: 120, caloriesKcal: 280, allergens: ["Lactose"], icon: "🧀" },
  { id: "cheese-gorgonzola", name: "Aged Gorgonzola Blue Cheese", category: "cheese", price: 3.0, weightG: 60, caloriesKcal: 210, allergens: ["Lactose"], icon: "🫕" },
  { id: "cheese-parmesan", name: "Parmigiano-Reggiano Flakes", category: "cheese", price: 2.8, weightG: 40, caloriesKcal: 160, allergens: ["Lactose"], icon: "🧀" },
  { id: "cheese-vegan", name: "Plant-Based Cashew Mozzarella", category: "cheese", price: 3.2, weightG: 100, caloriesKcal: 220, allergens: ["Nuts"], icon: "🌱" },

  // Meats
  { id: "meat-pepperoni", name: "Spicy Italian Pepperoni", category: "meat", price: 2.8, weightG: 70, caloriesKcal: 220, allergens: [], icon: "🍕" },
  { id: "meat-prosciutto", name: "Prosciutto di Parma", category: "meat", price: 3.5, weightG: 60, caloriesKcal: 180, allergens: [], icon: "🥓" },
  { id: "meat-chicken", name: "Herb Grilled Chicken Breast", category: "meat", price: 2.6, weightG: 80, caloriesKcal: 140, allergens: [], icon: "🍗" },
  { id: "meat-bacon", name: "Crispy Smoked Bacon Bits", category: "meat", price: 2.8, weightG: 60, caloriesKcal: 240, allergens: [], icon: "🥓" },

  // Veggies
  { id: "veg-mushrooms", name: "Sliced Button Mushrooms", category: "vegetable", price: 1.6, weightG: 60, caloriesKcal: 20, allergens: [], icon: "🍄" },
  { id: "veg-peppers", name: "Sweet Bell Pepper Ribbons", category: "vegetable", price: 1.5, weightG: 60, caloriesKcal: 25, allergens: [], icon: "🫑" },
  { id: "veg-olives", name: "Kalamata Black Olives", category: "vegetable", price: 1.8, weightG: 50, caloriesKcal: 70, allergens: [], icon: "🫒" },
  { id: "veg-artichokes", name: "Marinated Artichoke Hearts", category: "vegetable", price: 2.4, weightG: 60, caloriesKcal: 40, allergens: [], icon: "🥬" },
  { id: "veg-onions", name: "Caramelized Red Onions", category: "vegetable", price: 1.2, weightG: 50, caloriesKcal: 30, allergens: [], icon: "🧅" },
  { id: "veg-spinach", name: "Organic Baby Spinach & Basil", category: "vegetable", price: 1.5, weightG: 40, caloriesKcal: 15, allergens: [], icon: "🍃" },
];

export default function ConstructorPage() {
  const {
    recipeName,
    size,
    dough,
    sauces,
    toppings,
    activeStep,
    showSlices,
    setRecipeName,
    setSize,
    setDough,
    setSaucePortion,
    setToppingPortion,
    setActiveStep,
    nextStep,
    prevStep,
    toggleShowSlices,
    resetToDefault,
    getMetrics,
  } = usePizzaBuilderStore();

  const [availableIngredients, setAvailableIngredients] = React.useState<Ingredient[]>(FALLBACK_INGREDIENTS);

  React.useEffect(() => {
    api.ingredients.index
      .get()
      .then((res) => {
        if (res.data && res.data.ingredients && res.data.ingredients.length > 0) {
          setAvailableIngredients(res.data.ingredients as Ingredient[]);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote ingredients list, using built-ins:", err);
      });
  }, []);

  const metrics = getMetrics();
  const sizeConfig = PIZZA_SIZE_CONFIGS[size as PizzaSizeId] ?? PIZZA_SIZE_CONFIGS.medium;
  const doughConfig = DOUGH_TYPE_CONFIGS[dough as DoughTypeId] ?? DOUGH_TYPE_CONFIGS.traditional;

  // Helper to get selected portion for an ingredient
  const getSelectedPortion = (ingredient: Ingredient): PortionPlacement | "none" => {
    if (ingredient.category === "sauce") {
      const match = (sauces as SelectedTopping[]).find((s) => s.ingredient.id === ingredient.id);
      return match ? match.portion : "none";
    }
    const match = (toppings as SelectedTopping[]).find((t) => t.ingredient.id === ingredient.id);
    return match ? match.portion : "none";
  };

  const handlePortionSelect = (ingredient: Ingredient, portion: PortionPlacement | "none") => {
    if (ingredient.category === "sauce") {
      setSaucePortion(ingredient, portion);
    } else {
      setToppingPortion(ingredient, portion);
    }
  };

  const addCustomPizzaItem = useCartStore((state) => state.addCustomPizzaItem);

  const handleAddToCart = () => {
    addCustomPizzaItem(recipeName, {
      size,
      dough,
      sauces,
      toppings,
      metrics,
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#34495e]/60">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f39c12]/15 border border-[#f39c12]/30 text-[#f39c12] text-xs font-bold uppercase tracking-wider mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Interactive Kitchen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ecf0f1] font-display tracking-tight">
            Pizza <span className="text-[#f39c12]">Constructor</span>
          </h1>
          <p className="text-sm text-[#95a5a6] mt-1">
            Build your dream pizza layer by layer. Real-time visual canvas, price & allergen tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={toggleShowSlices}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              showSlices
                ? "bg-[#f39c12]/20 border-[#f39c12] text-[#f39c12]"
                : "bg-[#1a252f] border-[#34495e]/60 text-[#95a5a6] hover:text-[#ecf0f1]"
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>{showSlices ? "Hide Slices" : "Show Cut Slices"}</span>
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Visual Canvas & Summary HUD (Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Canvas Card */}
          <div className="bg-[#1a252f] border border-[#34495e]/70 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#0f171e]/85 backdrop-blur-md text-[#f39c12] border border-[#f39c12]/30">
                {sizeConfig.name} • {doughConfig.name}
              </span>
            </div>

            {/* Interactive SVG Pizza Canvas */}
            <div className="w-full max-w-[380px] p-2">
              <PizzaCanvas
                size={size}
                dough={dough}
                sauces={sauces}
                toppings={toppings}
                showSlices={showSlices}
                sliceCount={8}
              />
            </div>

            {/* Recipe Name Input */}
            <div className="w-full mt-4 pt-4 border-t border-[#34495e]/50">
              <label className="text-[10px] uppercase font-bold text-[#7f8c8d] tracking-wider block mb-1">
                Name Your Creation
              </label>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="E.g., Grandma's Secret Recipe"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0f171e] border border-[#34495e]/70 text-sm font-semibold text-[#ecf0f1] focus:outline-none focus:border-[#f39c12] transition-colors"
              />
            </div>
          </div>

          {/* Live Summary Panel */}
          <LiveSummaryPanel
            metrics={metrics}
            recipeName={recipeName}
            onAddToCart={handleAddToCart}
            onReset={resetToDefault}
          />
        </div>

        {/* RIGHT COLUMN: Step Wizard Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step Navigation Tabs */}
          <StepWizardNav currentStep={activeStep} onSelectStep={setActiveStep} />

          {/* Step Content Container */}
          <div className="bg-[#1a252f]/80 border border-[#34495e]/70 rounded-3xl p-6 shadow-xl min-h-[460px] flex flex-col justify-between">
            {/* STEP 1: SIZE & CRUST */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
                    1. Choose Size & Crust Type
                  </h3>
                  <p className="text-xs text-[#95a5a6] mt-1">
                    Select your pizza diameter and artisan crust formulation.
                  </p>
                </div>

                {/* Size Radio Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">
                    Pizza Diameter
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(PIZZA_SIZE_CONFIGS) as PizzaSizeId[]).map((sId) => {
                      const cfg = PIZZA_SIZE_CONFIGS[sId];
                      const isSelected = size === sId;
                      return (
                        <button
                          key={sId}
                          type="button"
                          onClick={() => setSize(sId)}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? "bg-[#f39c12]/15 border-[#f39c12] text-[#f39c12] shadow-lg shadow-[#f39c12]/15 font-bold"
                              : "bg-[#0f171e]/60 border-[#34495e]/60 text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#0f171e]"
                          }`}
                        >
                          <div className="text-sm font-bold">{cfg.name}</div>
                          <div className="text-xs text-[#7f8c8d] mt-1">{cfg.baseWeightG}g • {cfg.baseCaloriesKcal} kcal</div>
                          <div className="text-sm font-extrabold text-[#f39c12] mt-2">
                            ${cfg.basePrice.toFixed(2)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Crust Types */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">
                    Crust Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(DOUGH_TYPE_CONFIGS) as DoughTypeId[]).map((dId) => {
                      const dCfg = DOUGH_TYPE_CONFIGS[dId];
                      const isSelected = dough === dId;
                      return (
                        <button
                          key={dId}
                          type="button"
                          onClick={() => setDough(dId)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? "bg-[#f39c12]/15 border-[#f39c12] text-[#f39c12] shadow-md font-bold"
                              : "bg-[#0f171e]/60 border-[#34495e]/60 text-[#95a5a6] hover:text-[#ecf0f1] hover:bg-[#0f171e]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#ecf0f1]">
                              {dCfg.name}
                            </span>
                            {dCfg.priceAddon > 0 && (
                              <span className="text-xs font-extrabold text-[#f39c12]">
                                +${dCfg.priceAddon.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1.5 mt-2">
                            {dCfg.allergens.length > 0 ? (
                              dCfg.allergens.map((a) => (
                                <span key={a} className="text-[9px] px-1.5 py-0.5 rounded bg-[#0f171e] text-[#e67e22] border border-[#f39c12]/30">
                                  {a}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#27ae60]/20 text-[#27ae60] border border-[#27ae60]/40">
                                Allergen-Free
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SAUCES */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
                    2. Signature Sauces
                  </h3>
                  <p className="text-xs text-[#95a5a6] mt-1">
                    Select your base sauce and placement (full or half).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableIngredients
                    .filter((i) => i.category === "sauce")
                    .map((item) => (
                      <IngredientCard
                        key={item.id}
                        ingredient={item}
                        currentPortion={getSelectedPortion(item)}
                        onSelectPortion={handlePortionSelect}
                        sizeMultiplier={sizeConfig.toppingMultiplier}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* STEP 3: CHEESES */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
                    3. Artisan Cheeses
                  </h3>
                  <p className="text-xs text-[#95a5a6] mt-1">
                    Pick your melting mozzarella, creamy gorgonzola, or plant-based cashew cheese.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableIngredients
                    .filter((i) => i.category === "cheese")
                    .map((item) => (
                      <IngredientCard
                        key={item.id}
                        ingredient={item}
                        currentPortion={getSelectedPortion(item)}
                        onSelectPortion={handlePortionSelect}
                        sizeMultiplier={sizeConfig.toppingMultiplier}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* STEP 4: MEATS */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
                    4. Meats & Proteins
                  </h3>
                  <p className="text-xs text-[#95a5a6] mt-1">
                    Add spicy pepperoni, Italian prosciutto, grilled chicken, or crispy bacon.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableIngredients
                    .filter((i) => i.category === "meat")
                    .map((item) => (
                      <IngredientCard
                        key={item.id}
                        ingredient={item}
                        currentPortion={getSelectedPortion(item)}
                        onSelectPortion={handlePortionSelect}
                        sizeMultiplier={sizeConfig.toppingMultiplier}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* STEP 5: VEGETABLES & EXTRAS */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
                    5. Vegetables & Fresh Herbs
                  </h3>
                  <p className="text-xs text-[#95a5a6] mt-1">
                    Layer sliced mushrooms, bell peppers, kalamata olives, artichokes, red onions, or baby spinach.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableIngredients
                    .filter((i) => i.category === "vegetable")
                    .map((item) => (
                      <IngredientCard
                        key={item.id}
                        ingredient={item}
                        currentPortion={getSelectedPortion(item)}
                        onSelectPortion={handlePortionSelect}
                        sizeMultiplier={sizeConfig.toppingMultiplier}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* STEP 6: RECIPE REVIEW */}
            {activeStep === 6 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#ecf0f1] font-display">
                    6. Recipe Review & Confirmation
                  </h3>
                  <p className="text-xs text-[#95a5a6] mt-1">
                    Verify all ingredients, portions, weight, and itemized pricing before placing your order.
                  </p>
                </div>

                {/* Itemized Breakdown Table */}
                <div className="bg-[#0f171e] rounded-2xl border border-[#34495e]/60 overflow-hidden">
                  <div className="p-3 bg-[#1a252f] border-b border-[#34495e]/60 flex items-center justify-between text-xs font-bold text-[#f39c12] uppercase tracking-wider">
                    <span>Ingredient / Component</span>
                    <span>Portion & Price</span>
                  </div>
                  <div className="divide-y divide-[#34495e]/40 max-h-60 overflow-y-auto">
                    {metrics.breakdown.map((item, idx: number) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-[#ecf0f1]">{item.name}</span>
                          <span className="text-[#7f8c8d] ml-2 font-mono">({item.weightG}g)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {item.portion !== "full" && (
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#1a252f] text-[#3498db]">
                              {item.portion}
                            </span>
                          )}
                          <span className="font-mono font-bold text-[#f39c12]">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-[#1a252f] border-t border-[#34495e]/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold text-[#7f8c8d] block">
                        Final Total
                      </span>
                      <span className="text-xs text-[#95a5a6]">
                        {metrics.totalWeightG}g • {metrics.totalCaloriesKcal} kcal
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold text-[#f39c12] font-display">
                      ${metrics.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Wizard Navigation Footer */}
            <div className="pt-6 mt-6 border-t border-[#34495e]/60 flex items-center justify-between">
              {activeStep > 1 ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={prevStep}
                  className="flex items-center space-x-1 text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Previous Stage</span>
                </Button>
              ) : (
                <Link href="/menu">
                  <Button variant="ghost" size="sm" className="text-xs text-[#7f8c8d]">
                    Back to Catalog
                  </Button>
                </Link>
              )}

              {activeStep < WIZARD_STEPS.length ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={nextStep}
                  className="flex items-center space-x-1 text-xs font-bold shadow-md shadow-[#f39c12]/20"
                >
                  <span>Next: {WIZARD_STEPS[activeStep]?.shortLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex items-center space-x-1.5 text-sm font-extrabold shadow-lg shadow-[#f39c12]/25"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1 text-[#27ae60]" />
                  <span>Complete & Add to Basket (${metrics.totalPrice.toFixed(2)})</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
