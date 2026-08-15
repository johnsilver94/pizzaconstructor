export type PizzaSizeId = "small" | "medium" | "large";
export type DoughTypeId = "traditional" | "thin" | "cheese_crust" | "gluten_free";

export interface Ingredient {
  id: string;
  name: string;
  category: "sauce" | "cheese" | "meat" | "vegetable" | "extra";
  price: number;
  weightG: number;
  caloriesKcal: number;
  allergens: string[];
  colorHex?: string;
  icon?: string;
}

export interface CustomPizzaRecipe {
  id?: string;
  name: string;
  size: PizzaSizeId;
  dough: DoughTypeId;
  ingredients: string[]; // ingredient IDs
  totalPrice: number;
  totalWeightG: number;
  totalCaloriesKcal: number;
  allergens: string[];
}

export interface GroupOrderSession {
  id: string;
  code: string;
  hostName: string;
  hostUserId?: string;
  title: string;
  deadline: string; // ISO String
  status: "open" | "locked" | "submitted" | "completed" | "cancelled";
  participantsCount: number;
  totalAmount: number;
}
