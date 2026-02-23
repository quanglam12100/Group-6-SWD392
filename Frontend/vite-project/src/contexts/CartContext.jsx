import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [tableId, setTableId] = useState(null);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    const savedTable = localStorage.getItem("tableId");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedTable) {
      setTableId(JSON.parse(savedTable));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    // Save tableId to localStorage
    if (tableId) {
      localStorage.setItem("tableId", JSON.stringify(tableId));
    }
  }, [tableId]);

  const addToCart = (product, variant, toppings = [], quantity = 1) => {
    const cartItem = {
      id: `${product.id}-${variant?.id || 'default'}-${toppings.map(t => t.id).join(',')}`,
      product,
      variant,
      toppings,
      quantity,
      price: calculateItemPrice(product, variant, toppings),
    };

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setTableId(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("tableId");
  };

  const calculateItemPrice = (product, variant, toppings) => {
    let price = product.price || 0;
    if (variant) {
      price = variant.price || price;
    }
    if (toppings && toppings.length > 0) {
      price += toppings.reduce((sum, topping) => sum + (topping.price || 0), 0);
    }
    return price;
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    tableId,
    setTableId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
