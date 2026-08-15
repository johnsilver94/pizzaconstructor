/**
 * PizzaConstructor Signature Theme Colors
 * Primary Gold: #f39c12 (Golden Orange)
 * Secondary Dark Slate: #2c3e50 (Dark Navy Slate)
 */
export const colors = {
  // Brand Primary & Accent
  primary: {
    DEFAULT: "#f39c12",
    hover: "#e67e22",
    active: "#d35400",
    light: "#fef5e7",
    subtle: "#fdebd0",
  },
  // Dark Slate & Neutrals
  slate: {
    DEFAULT: "#2c3e50",
    dark: "#1a252f",
    darker: "#0f171e",
    light: "#34495e",
    lighter: "#7f8c8d",
    muted: "#95a5a6",
    surface: "#ecf0f1",
    background: "#f8f9fa",
  },
  // Semantic status colors
  semantic: {
    success: "#27ae60",
    successLight: "#eafaf1",
    warning: "#f39c12",
    warningLight: "#fef9e7",
    danger: "#e74c3c",
    dangerLight: "#fdedec",
    info: "#2980b9",
    infoLight: "#ebf5fb",
  },
  // Crust & Ingredient palette
  ingredient: {
    dough: "#f5d76e",
    crustBaked: "#d35400",
    tomatoSauce: "#c0392b",
    cheeseMozzarella: "#f9e79f",
    basil: "#27ae60",
    pepperoni: "#b03a2e",
    mushroom: "#aab7b8",
    olive: "#2c3e50",
    bacon: "#922b21",
    onion: "#af7ac5",
    pepper: "#229954",
  },
} as const;

export type ThemeColors = typeof colors;
