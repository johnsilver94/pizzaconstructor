import { describe, expect, it } from "bun:test";
import {
  calculatePizzaRecipe,
  PIZZA_SIZE_CONFIGS,
  DOUGH_TYPE_CONFIGS,
  type Ingredient,
} from "../src";

const tomatoSauce: Ingredient = {
  id: "sauce-tomato",
  name: "Tomato Sauce",
  category: "sauce",
  price: 1.5,
  weightG: 80,
  caloriesKcal: 45,
  allergens: [],
};

const mozzarella: Ingredient = {
  id: "cheese-mozzarella",
  name: "Mozzarella",
  category: "cheese",
  price: 2.5,
  weightG: 120,
  caloriesKcal: 280,
  allergens: ["Lactose"],
};

const pepperoni: Ingredient = {
  id: "meat-pepperoni",
  name: "Pepperoni",
  category: "meat",
  price: 2.8,
  weightG: 70,
  caloriesKcal: 220,
  allergens: [],
};

describe("Pizza Calculation Engine", () => {
  it("calculates base crust metrics for standard plain pizza", () => {
    const metrics = calculatePizzaRecipe({
      size: "medium",
      dough: "traditional",
      sauces: [],
      toppings: [],
    });

    expect(metrics.totalPrice).toBe(11.99);
    expect(metrics.totalWeightG).toBe(450);
    expect(metrics.totalCaloriesKcal).toBe(920);
    expect(metrics.allergens).toContain("Gluten");
    expect(metrics.allergens.length).toBe(1);
  });

  it("calculates Margherita recipe with sauces and cheese accurately", () => {
    const metrics = calculatePizzaRecipe({
      size: "small", // 1.0x topping multiplier
      dough: "traditional",
      sauces: [{ ingredient: tomatoSauce, portion: "full" }],
      toppings: [{ ingredient: mozzarella, portion: "full" }],
    });

    // Base Small (8.99) + Sauce (1.50) + Mozzarella (2.50) = 12.99
    expect(metrics.totalPrice).toBe(12.99);
    expect(metrics.totalWeightG).toBe(320 + 80 + 120);
    expect(metrics.totalCaloriesKcal).toBe(680 + 45 + 280);
    expect(metrics.allergens).toContain("Gluten");
    expect(metrics.allergens).toContain("Lactose");
  });

  it("applies stuffed cheese crust addon and allergens correctly", () => {
    const metrics = calculatePizzaRecipe({
      size: "medium",
      dough: "cheese_crust",
      sauces: [{ ingredient: tomatoSauce, portion: "full" }],
      toppings: [],
    });

    // Medium Base (11.99) + Stuffed Crust (+3.50) + Sauce (1.50 * 1.25 = 1.88) = 17.37
    expect(metrics.totalPrice).toBe(17.37);
    expect(metrics.allergens).toContain("Gluten");
    expect(metrics.allergens).toContain("Lactose");
  });

  it("handles double portion multiplier correctly", () => {
    const metrics = calculatePizzaRecipe({
      size: "small",
      dough: "traditional",
      sauces: [],
      toppings: [{ ingredient: pepperoni, portion: "double" }],
    });

    // Base Small (8.99) + Double Pepperoni (2.80 * 1.8 = 5.04) = 14.03
    expect(metrics.totalPrice).toBe(14.03);
    // Weight multiplier is 2.0x for double: 320 + (70 * 2) = 460
    expect(metrics.totalWeightG).toBe(460);
  });

  it("supports certified gluten-free crust without gluten allergen", () => {
    const metrics = calculatePizzaRecipe({
      size: "small",
      dough: "gluten_free",
      sauces: [{ ingredient: tomatoSauce, portion: "full" }],
      toppings: [],
    });

    // Small (8.99) + Gluten Free Addon (2.99) + Sauce (1.50) = 13.48
    expect(metrics.totalPrice).toBe(13.48);
    expect(metrics.allergens.includes("Gluten")).toBe(false);
  });
});
