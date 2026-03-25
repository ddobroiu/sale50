"use client";
import React from 'react';
import { useWishlist } from '@/components/WishlistContext';
import { useCart } from '@/components/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addItem } = useCart();

    if (wishlist.length === 0) {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <div className="container" style={{ padding: '12rem 0', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}>
                        <Heart size={32} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Favoritele Tale</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Momentan nu ai adăugat niciun produs în lista de favorite.</p>
                    <Link href="/products" className="btn btn-primary">Vezi Catalogul</Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '8rem' }}>
            <div className="container" style={{ paddingTop: '6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Favorite <span style={{color: 'var(--primary)'}}>({wishlist.length})</span></h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>Produsele salvate pentru vizionare ulterioară.</p>
                    </div>
                </div>

                <div className="grid-cols-4">
                    {wishlist.map((item) => (
                        <div key={item.sku} className="card" style={{ position: 'relative' }}>
                            <button 
                                onClick={() => removeFromWishlist(item.sku)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'rgba(255,255,255,0.8)', border: 'none', padding: '0.5rem', borderRadius: '50%', color: 'var(--error)', cursor: 'pointer', transition: 'all 0.2s' }}
                                className="remove-fav"
                            >
                                <Trash2 size={16} />
                            </button>
                            
                            <Link href={`/product/${item.sku}`} style={{ textDecoration: 'none' }}>
                                <div className="card-img-wrap" style={{ padding: '2.5rem' }}>
                                    <img src={item.image} alt={item.name} />
                                </div>
                            </Link>
                            
                            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <Link href={`/product/${item.sku}`} style={{ textDecoration: 'none', flex: 1 }}>
                                    <h3 style={{ 
                                        fontSize: '1rem', 
                                        fontWeight: 600, 
                                        lineHeight: 1.4, 
                                        marginBottom: '1.5rem', 
                                        height: '2.8rem', 
                                        overflow: 'hidden', 
                                        color: 'var(--dark)',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>{item.name}</h3>
                                </Link>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--dark)' }}>{item.price.toFixed(2)} Lei</span>
                                    <button 
                                        onClick={() => addItem({ ...item, quantity: 1 })}
                                        className="btn btn-primary" 
                                        style={{ padding: '0.6rem', borderRadius: '12px' }}
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .remove-fav:hover { background: var(--error) !important; color: white !important; transform: scale(1.1); }
            `}} />
        </main>
    );
}
