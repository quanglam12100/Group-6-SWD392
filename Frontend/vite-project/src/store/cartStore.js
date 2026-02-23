import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart
      addToCart: (item) => {
        const { items } = get();
        const existingItem = items.find(
          (i) =>
            i.product_id === item.product_id &&
            i.variant_id === item.variant_id &&
            JSON.stringify(i.toppings) === JSON.stringify(item.toppings)
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.product_id === existingItem.product_id &&
              i.variant_id === existingItem.variant_id &&
              JSON.stringify(i.toppings) === JSON.stringify(existingItem.toppings)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      // Remove item from cart
      removeFromCart: (index) => {
        const { items } = get();
        set({ items: items.filter((_, i) => i !== index) });
      },

      // Update item quantity
      updateQuantity: (index, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeFromCart(index);
          return;
        }
        set({
          items: items.map((item, i) =>
            i === index ? { ...item, quantity } : item
          ),
        });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Get total price
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const itemTotal = (item.price || 0) * item.quantity;
          const toppingsTotal = (item.toppings || []).reduce(
            (sum, topping) => sum + (topping.price || 0) * item.quantity,
            0
          );
          return total + itemTotal + toppingsTotal;
        }, 0);
      },

      // Get item count
      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
