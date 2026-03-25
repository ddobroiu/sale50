"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type WishlistItem = {
  sku: string;
  name: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (sku: string) => void;
  isInWishlist: (sku: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sale50_wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sale50_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist(prev => {
      if (prev.find(i => i.sku === item.sku)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (sku: string) => {
    setWishlist(prev => prev.filter(i => i.sku !== sku));
  };

  const isInWishlist = (sku: string) => {
    return wishlist.some(i => i.sku === sku);
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.sku)) {
      removeFromWishlist(item.sku);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
