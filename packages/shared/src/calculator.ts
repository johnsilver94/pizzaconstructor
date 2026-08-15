import type {
  PizzaSizeId,
  DoughTypeId,
  Ingredient,
} from "./types";

export type PortionPlacement = "full" | "left" | "right" | "double";

export interface SelectedTopping {
  ingredient: Ingredient;
  portion: PortionPlacement;
}

export interface PizzaRecipeInput {
  size: PizzaSizeId;
  dough: DoughTypeId;
  sauces: SelectedTopping[];
  toppings: SelectedTopping[];
}

export interface CalculationBreakdownItem {
  name: string;
  category: "crust" | "dough_addon" | "sauce" | "topping";
  portion: PortionPlacement;
  price: number;
  weightG: number;
  caloriesKcal: number;
  allergens: string[];
}

export interface CalculatedPizzaMetrics {
  size: PizzaSizeId;
  dough: DoughTypeId;
  totalPrice: number;
  totalWeightG: number;
  totalCaloriesKcal: number;
  allergens: string[];
  itemsCount: number;
  breakdown: CalculationBreakdownItem[];
}

export interface PizzaSizeConfig {
  id: PizzaSizeId;
  name: string;
  diameterCm: number;
  basePrice: number;
  baseWeightG: number;
  baseCaloriesKcal: number;
  toppingMultiplier: number;
}

export interface DoughTypeConfig {
  id: DoughTypeId;
  name: string;
  priceAddon: number;
  weightAdjustmentG: number;
  caloriesAdjustmentKcal: number;
  allergens: string[];
}

export const PIZZA_SIZE_CONFIGS: Record<PizzaSizeId, PizzaSizeConfig> = {
  small: {
    id: "small",
    name: "Small (25cm)",
    diameterCm: 25,
    basePrice: 8.99,
    baseWeightG: 320,
    baseCaloriesKcal: 680,
    toppingMultiplier: 1.0,
  },
  medium: {
    id: "medium",
    name: "Medium (30cm)",
    diameterCm: 30,
    basePrice: 11.99,
    baseWeightG: 450,
    baseCaloriesKcal: 920,
    toppingMultiplier: 1.25,
  },
  large: {
    id: "large",
    name: "Large (35cm)",
    diameterCm: 35,
    basePrice: 14.99,
    baseWeightG: 580,
    baseCaloriesKcal: 1180,
    toppingMultiplier: 1.5,
  },
};

export const DOUGH_TYPE_CONFIGS: Record<DoughTypeId, DoughTypeConfig> = {
  traditional: {
    id: "traditional",
    name: "Traditional Hand-Tossed",
    priceAddon: 0,
    weightAdjustmentG: 0,
    caloriesAdjustmentKcal: 0,
    allergens: ["Gluten"],
  },
  thin: {
    id: "thin",
    name: "Crispy Thin Italian",
    priceAddon: 0,
    weightAdjustmentG: -60,
    caloriesAdjustmentKcal: -120,
    allergens: ["Gluten"],
  },
  cheese_crust: {
    id: "cheese_crust",
    name: "Stuffed Mozzarella Crust",
    priceAddon: 3.5,
    weightAdjustmentG: 120,
    caloriesAdjustmentKcal: 260,
    allergens: ["Gluten", "Lactose"],
  },
  gluten_free: {
    id: "gluten_free",
    name: "Certified Gluten-Free Base",
    priceAddon: 2.99,
    weightAdjustmentG: -20,
    caloriesAdjustmentKcal: -40,
    allergens: [],
  },
};

export const PORTION_MULTIPLIERS: Record<PortionPlacement, number> = {
  full: 1.0,
  left: 0.5,
  right: 0.5,
  double: 1.8, // 1.8x price for double portion discount
};

export const PORTION_WEIGHT_MULTIPLIERS: Record<PortionPlacement, number> = {
  full: 1.0,
  left: 0.5,
  right: 0.5,
  double: 2.0,
};

export function calculatePizzaRecipe(input: PizzaRecipeInput): CalculatedPizzaMetrics {
  const sizeConfig = PIZZA_SIZE_CONFIGS[input.size] || PIZZA_SIZE_CONFIGS.medium;
  const doughConfig = DOUGH_TYPE_CONFIGS[input.dough] || DOUGH_TYPE_CONFIGS.traditional;

  const breakdown: CalculationBreakdownItem[] = [];
  const allergenSet = new Set<string>();

  // 1. Base Crust
  breakdown.push({
    name: `${sizeConfig.name} Crust`,
    category: "crust",
    portion: "full",
    price: sizeConfig.basePrice,
    weightG: sizeConfig.baseWeightG,
    caloriesKcal: sizeConfig.baseCaloriesKcal,
    allergens: [...doughConfig.allergens],
  });
  doughConfig.allergens.forEach((a) => allergenSet.add(a));

  // 2. Dough Add-on (if applicable)
  if (doughConfig.priceAddon > 0 || doughConfig.weightAdjustmentG !== 0) {
    breakdown.push({
      name: `${doughConfig.name} Option`,
      category: "dough_addon",
      portion: "full",
      price: doughConfig.priceAddon,
      weightG: doughConfig.weightAdjustmentG,
      caloriesKcal: doughConfig.caloriesAdjustmentKcal,
      allergens: [],
    });
  }

  // 3. Sauces
  for (const item of input.sauces) {
    const pMult = PORTION_MULTIPLIERS[item.portion] ?? 1.0;
    const wMult = PORTION_WEIGHT_MULTIPLIERS[item.portion] ?? 1.0;
    const itemPrice = Number((item.ingredient.price * sizeConfig.toppingMultiplier * pMult).toFixed(2));
    const itemWeight = Math.round(item.ingredient.weightG * sizeConfig.toppingMultiplier * wMult);
    const itemCals = Math.round(item.ingredient.caloriesKcal * sizeConfig.toppingMultiplier * wMult);

    breakdown.push({
      name: item.ingredient.name,
      category: "sauce",
      portion: item.portion,
      price: itemPrice,
      weightG: itemWeight,
      caloriesKcal: itemCals,
      allergens: item.ingredient.allergens,
    });

    item.ingredient.allergens.forEach((a) => allergenSet.add(a));
  }

  // 4. Toppings
  for (const item of input.toppings) {
    const pMult = PORTION_MULTIPLIERS[item.portion] ?? 1.0;
    const wMult = PORTION_WEIGHT_MULTIPLIERS[item.portion] ?? 1.0;
    const itemPrice = Number((item.ingredient.price * sizeConfig.toppingMultiplier * pMult).toFixed(2));
    const itemWeight = Math.round(item.ingredient.weightG * sizeConfig.toppingMultiplier * wMult);
    const itemCals = Math.round(item.ingredient.caloriesKcal * sizeConfig.toppingMultiplier * wMult);

    breakdown.push({
      name: item.ingredient.name,
      category: "topping",
      portion: item.portion,
      price: itemPrice,
      weightG: itemWeight,
      caloriesKcal: itemCals,
      allergens: item.ingredient.allergens,
    });

    item.ingredient.allergens.forEach((a) => allergenSet.add(a));
  }

  const totalPrice = Number(
    breakdown.reduce((sum, item) => sum + item.price, 0).toFixed(2)
  );
  const totalWeightG = Math.max(
    100,
    breakdown.reduce((sum, item) => sum + item.weightG, 0)
  );
  const totalCaloriesKcal = Math.max(
    200,
    breakdown.reduce((sum, item) => sum + item.caloriesKcal, 0)
  );

  return {
    size: input.size,
    dough: input.dough,
    totalPrice,
    totalWeightG,
    totalCaloriesKcal,
    allergens: Array.from(allergenSet).sort(),
    itemsCount: input.sauces.length + input.toppings.length,
    breakdown,
  };
}
