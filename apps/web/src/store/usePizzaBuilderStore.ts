import { create } from "zustand";
import {
  type PizzaSizeId,
  type DoughTypeId,
  type SelectedTopping,
  type PortionPlacement,
  type Ingredient,
  type CalculatedPizzaMetrics,
  calculatePizzaRecipe,
} from "@pizzaconstructor/shared";

export interface PizzaBuilderState {
  recipeName: string;
  size: PizzaSizeId;
  dough: DoughTypeId;
  sauces: SelectedTopping[];
  toppings: SelectedTopping[];
  activeStep: number; // 1 to 6
  showSlices: boolean;

  // Actions
  setRecipeName: (name: string) => void;
  setSize: (size: PizzaSizeId) => void;
  setDough: (dough: DoughTypeId) => void;
  setSaucePortion: (ingredient: Ingredient, portion: PortionPlacement | "none") => void;
  setToppingPortion: (ingredient: Ingredient, portion: PortionPlacement | "none") => void;
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  toggleShowSlices: () => void;
  resetToDefault: () => void;
  loadPreset: (preset: {
    name: string;
    size: PizzaSizeId;
    dough: DoughTypeId;
    sauces: SelectedTopping[];
    toppings: SelectedTopping[];
  }) => void;

  // Computed helper
  getMetrics: () => CalculatedPizzaMetrics;
}

const DEFAULT_SAUCE: SelectedTopping = {
  ingredient: {
    id: "sauce-tomato",
    name: "San Marzano Tomato Sauce",
    category: "sauce",
    price: 1.5,
    weightG: 80,
    caloriesKcal: 45,
    allergens: [],
    colorHex: "#e74c3c",
    icon: "🍅",
  },
  portion: "full",
};

const DEFAULT_CHEESE: SelectedTopping = {
  ingredient: {
    id: "cheese-mozzarella",
    name: "Fior di Latte Mozzarella",
    category: "cheese",
    price: 2.5,
    weightG: 120,
    caloriesKcal: 280,
    allergens: ["Lactose"],
    colorHex: "#f4f6f7",
    icon: "🧀",
  },
  portion: "full",
};

export const usePizzaBuilderStore = create<PizzaBuilderState>((set, get) => ({
  recipeName: "My Custom Artisan Pizza",
  size: "medium",
  dough: "traditional",
  sauces: [DEFAULT_SAUCE],
  toppings: [DEFAULT_CHEESE],
  activeStep: 1,
  showSlices: false,

  setRecipeName: (name: string) => set({ recipeName: name }),
  setSize: (size: PizzaSizeId) => set({ size }),
  setDough: (dough: DoughTypeId) => set({ dough }),

  setSaucePortion: (ingredient: Ingredient, portion: PortionPlacement | "none") => {
    set((state: PizzaBuilderState) => {
      if (portion === "none") {
        return { sauces: state.sauces.filter((s) => s.ingredient.id !== ingredient.id) };
      }
      const existing = state.sauces.find((s) => s.ingredient.id === ingredient.id);
      if (existing) {
        return {
          sauces: state.sauces.map((s) =>
            s.ingredient.id === ingredient.id ? { ...s, portion } : s
          ),
        };
      }
      return { sauces: [...state.sauces, { ingredient, portion }] };
    });
  },

  setToppingPortion: (ingredient: Ingredient, portion: PortionPlacement | "none") => {
    set((state: PizzaBuilderState) => {
      if (portion === "none") {
        return { toppings: state.toppings.filter((t) => t.ingredient.id !== ingredient.id) };
      }
      const existing = state.toppings.find((t) => t.ingredient.id === ingredient.id);
      if (existing) {
        return {
          toppings: state.toppings.map((t) =>
            t.ingredient.id === ingredient.id ? { ...t, portion } : t
          ),
        };
      }
      return { toppings: [...state.toppings, { ingredient, portion }] };
    });
  },

  setActiveStep: (step: number) => set({ activeStep: Math.min(6, Math.max(1, step)) }),
  nextStep: () => set((state: PizzaBuilderState) => ({ activeStep: Math.min(6, state.activeStep + 1) })),
  prevStep: () => set((state: PizzaBuilderState) => ({ activeStep: Math.max(1, state.activeStep - 1) })),
  toggleShowSlices: () => set((state: PizzaBuilderState) => ({ showSlices: !state.showSlices })),

  resetToDefault: () =>
    set({
      recipeName: "My Custom Artisan Pizza",
      size: "medium",
      dough: "traditional",
      sauces: [DEFAULT_SAUCE],
      toppings: [DEFAULT_CHEESE],
      activeStep: 1,
      showSlices: false,
    }),

  loadPreset: (preset) =>
    set({
      recipeName: preset.name,
      size: preset.size,
      dough: preset.dough,
      sauces: preset.sauces,
      toppings: preset.toppings,
      activeStep: 1,
    }),

  getMetrics: () => {
    const { size, dough, sauces, toppings } = get();
    return calculatePizzaRecipe({ size, dough, sauces, toppings });
  },
}));
