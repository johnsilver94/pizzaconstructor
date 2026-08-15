export const PIZZA_SIZES = {
  SMALL: { id: "small", name: "Small", diameterCm: 25, basePrice: 8.99, baseWeightG: 320 },
  MEDIUM: { id: "medium", name: "Medium", diameterCm: 30, basePrice: 12.99, baseWeightG: 480 },
  LARGE: { id: "large", name: "Large", diameterCm: 35, basePrice: 16.99, baseWeightG: 640 },
} as const;

export const DOUGH_TYPES = {
  TRADITIONAL: { id: "traditional", name: "Traditional Hand-Tossed", extraPrice: 0 },
  THIN: { id: "thin", name: "Thin & Crispy", extraPrice: 0 },
  CHEESE_CRUST: { id: "cheese_crust", name: "Cheese-Stuffed Crust", extraPrice: 2.5 },
  GLUTEN_FREE: { id: "gluten_free", name: "Gluten-Free Crust", extraPrice: 3.0 },
} as const;

export const CATEGORIES = [
  "pizzas",
  "constructor",
  "salads",
  "desserts",
  "drinks",
] as const;
