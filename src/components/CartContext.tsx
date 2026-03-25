"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, qty: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("modernshop_cart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch { }
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("modernshop_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.sku === item.sku);
      if (existing) {
        return prev.map(i => i.sku === item.sku ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeItem = (sku: string) => {
    setCart(prev => prev.filter(i => i.sku !== sku));
  };

  const updateQuantity = (sku: string, qty: number) => {
    if (qty < 1) return removeItem(sku);
    setCart(prev => prev.map(i => i.sku === sku ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
