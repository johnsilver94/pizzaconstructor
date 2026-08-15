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

// ---------------------------------------------
// Group Orders Domain Models
// ---------------------------------------------
export type GroupOrderStatus = "open" | "locked" | "submitted" | "completed" | "cancelled";

export interface GroupParticipant {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  joinedAt: string;
}

export interface GroupOrderItem {
  id: string;
  participantId: string;
  participantName: string;
  name: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
  weightG: number;
  allergens: string[];
  customDetails?: {
    size: PizzaSizeId;
    dough: DoughTypeId;
    sauceNames: string[];
    toppingNames: string[];
  };
  createdAt: string;
}

export interface GroupOrderRoom {
  id: string; // URL slug e.g. "team-lunch-847" or uuid
  title: string;
  hostId: string;
  hostName: string;
  hostToken: string; // Secret token for host controls
  status: GroupOrderStatus;
  deadlineIso?: string;
  deliveryAddress?: string;
  maxParticipants?: number;
  participants: GroupParticipant[];
  items: GroupOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type GroupWsMessageType =
  | "JOIN_ROOM"
  | "LEAVE_ROOM"
  | "ADD_ITEM"
  | "REMOVE_ITEM"
  | "SET_STATUS"
  | "ROOM_SYNC"
  | "ERROR";

export interface GroupWsMessage {
  type: GroupWsMessageType;
  payload?: unknown;
  roomId?: string;
  participantId?: string;
}
