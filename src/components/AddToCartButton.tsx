"use client";
import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ShoppingBag, Check } from 'lucide-react';

type Props = {
  product: {
    sku: string;
    name: string;
    priceWithVat: number;
    image: string;
  }
};

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.priceWithVat,
      image: product.image,
      quantity: 1
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      style={{
        width: '100%',
        background: added ? '#16a34a' : '#000',
        color: 'white',
        padding: '1.5rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '1rem',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.3s ease',
        letterSpacing: '0.02em'
      }}
    >
      {added ? <Check size={20} /> : <ShoppingBag size={20} />}
      {added ? 'Adăugat în Coș' : 'Adaugă în Coș'}
    </button>
  );
}
