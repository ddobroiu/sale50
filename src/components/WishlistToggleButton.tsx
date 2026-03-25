"use client";
import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from './WishlistContext';

interface Props {
  product: any;
  showText?: boolean;
}

export default function WishlistToggleButton({ product, showText = false }: Props) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.sku);

  return (
    <button
      onClick={() => toggleWishlist({
        sku: product.sku,
        name: product.name,
        price: product.priceWithVat,
        image: product.image
      })}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: showText ? '0.85rem 1.5rem' : '0.85rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        background: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        color: isLiked ? 'var(--error)' : 'var(--text-muted)',
        fontWeight: 700,
        fontSize: '0.9rem',
        boxShadow: 'var(--shadow-sm)'
      }}
      className="wishlist-detail-btn"
    >
      <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
      {showText && (isLiked ? 'Adăugat la Favorite' : 'Adaugă la Favorite')}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .wishlist-detail-btn:hover {
          border-color: var(--error);
          color: var(--error);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
        }
      `}} />
    </button>
  );
}
