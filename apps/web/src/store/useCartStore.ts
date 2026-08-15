import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Product,
  SizePriceOption,
  PizzaSizeId,
  DoughTypeId,
  SelectedTopping,
  CalculatedPizzaMetrics,
} from "@pizzaconstructor/shared";

export interface CustomPizzaDetails {
  size: PizzaSizeId;
  dough: DoughTypeId;
  sauces: SelectedTopping[];
  toppings: SelectedTopping[];
  metrics: CalculatedPizzaMetrics;
}

export interface CartItem {
  id: string; // Unique cart item identifier (uuid or composite key)
  type: "catalog" | "custom_pizza";
  productId?: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  sizeLabel: string;
  weightG: number;
  allergens: string[];
  customDetails?: CustomPizzaDetails;
}

export interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  promoCode: string;
  discountPercent: number; // e.g., 10 for 10%

  // Actions
  addCatalogItem: (product: Product, sizeOption: SizePriceOption, quantity?: number) => void;
  addCustomPizzaItem: (name: string, customDetails: CustomPizzaDetails, quantity?: number) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Computed Helpers
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      promoCode: "",
      discountPercent: 0,

      addCatalogItem: (product, sizeOption, quantity = 1) => {
        const itemId = `${product._id || product.id || product.name}-${sizeOption.size}`;
        set((state) => {
          const existing = state.items.find((i) => i.id === itemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
              ),
              isDrawerOpen: true,
            };
          }

          const newItem: CartItem = {
            id: itemId,
            type: "catalog",
            productId: product._id || product.id,
            name: product.name,
            image: product.image,
            unitPrice: sizeOption.price,
            quantity,
            sizeLabel: sizeOption.size,
            weightG: sizeOption.weightG || 500,
            allergens: (product.allergens || []).map((a) => a.name),
          };

          return {
            items: [...state.items, newItem],
            isDrawerOpen: true,
          };
        });
      },

      addCustomPizzaItem: (name, customDetails, quantity = 1) => {
        const itemId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newItem: CartItem = {
          id: itemId,
          type: "custom_pizza",
          name: name || "Custom Artisan Pizza",
          image: "/img/pizza_medium.png",
          unitPrice: customDetails.metrics.totalPrice,
          quantity,
          sizeLabel: customDetails.metrics.size.toUpperCase(),
          weightG: customDetails.metrics.totalWeightG,
          allergens: customDetails.metrics.allergens,
          customDetails,
        };

        set((state) => ({
          items: [...state.items, newItem],
          isDrawerOpen: true,
        }));
      },

      updateQuantity: (itemId, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === itemId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      clearCart: () => set({ items: [], promoCode: "", discountPercent: 0 }),

      applyPromoCode: (code) => {
        const upper = code.trim().toUpperCase();
        if (upper === "PIZZA10" || upper === "WELCOME10") {
          set({ promoCode: upper, discountPercent: 10 });
          return true;
        }
        if (upper === "FREESHIP" || upper === "PIZZA20") {
          set({ promoCode: upper, discountPercent: 20 });
          return true;
        }
        return false;
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getSubtotal: () => {
        return Number(
          get()
            .items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
            .toFixed(2)
        );
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const percent = get().discountPercent;
        return Number(((subtotal * percent) / 100).toFixed(2));
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 35) return 0; // Free delivery over $35
        return 3.99;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const delivery = get().getDeliveryFee();
        return Number(Math.max(0, subtotal - discount + delivery).toFixed(2));
      },
    }),
    {
      name: "pizza-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
      }),
    }
  )
);
