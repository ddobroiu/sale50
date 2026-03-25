"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from './WishlistContext';
import { useCart } from './CartContext';

interface ProductCardProps {
    product: any;
    citySlug?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, citySlug }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addItem } = useCart();
    const isLiked = isInWishlist(product.sku);

    const href = citySlug 
        ? `/${citySlug}/product/${product.sku}` 
        : `/product/${product.sku}`;

    return (
        <div className="card" style={{ textDecoration: 'none', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div className="card-img-wrap" style={{ position: 'relative', aspectRatio: '1', padding: '2rem' }}>
                <Link href={href} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                </Link>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', zIndex: 10 }}>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist({
                                sku: product.sku,
                                name: product.name,
                                price: product.priceWithVat,
                                image: product.image
                            });
                        }}
                        style={{ 
                            background: 'white', 
                            border: '1px solid var(--border-color)', 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                            color: isLiked ? 'var(--error)' : 'var(--text-light)',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className="wishlist-btn-hover"
                        title={isLiked ? "Elimină de la favorite" : "Adaugă la favorite"}
                    >
                        <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    {product.priceWithVat < 50 && <div className="badge badge-hot" style={{ fontSize: '0.6rem' }}>OFERTĂ</div>}
                </div>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Link href={href} style={{ textDecoration: 'none', flex: 1, display: 'block' }}>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>{product.category}</span>
                    <h3 style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: 700, 
                        marginBottom: '1rem', 
                        color: 'var(--dark)', 
                        height: '2.6rem', 
                        overflow: 'hidden', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4
                    }}>{product.name}</h3>
                </Link>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-soft)' }}>
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>{product.priceWithVat.toFixed(2)} Lei</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>{(product.priceWithVat * 1.3).toFixed(2)} Lei</div>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            addItem({ ...product, price: product.priceWithVat, quantity: 1 });
                        }}
                        style={{ border: 'none', width: '42px', height: '42px', background: 'var(--dark)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        className="add-btn-hover"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .wishlist-btn-hover:hover { 
                    transform: scale(1.1); 
                    color: var(--error) !important;
                    border-color: var(--error) !important;
                }
                .add-btn-hover:hover {
                    background: var(--primary) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }
            `}} />
        </div>
    );
};

export default ProductCard;
