export type CategorySlug = "pizza" | "salad" | "desert" | "beverages" | "vegan";

export type PizzaSizeId = "small" | "medium" | "large";
export type DoughTypeId = "traditional" | "thin" | "cheese_crust" | "gluten_free";

export interface Allergen {
  id: string;
  name: string;
  badgeColor?: string;
}

export interface SizePriceOption {
  size: string;
  price: number;
  weightG?: number;
}

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

export interface Product {
  id?: string;
  _id?: string;
  name: string;
  category: CategorySlug;
  description?: string;
  image?: string;
  ingredients: { name: string }[];
  allergens: { name: string }[];
  sizePrices: SizePriceOption[];
  isAvailable?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
