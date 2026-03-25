"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeItem, updateQuantity, total } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (cart.length === 0) {
        return (
            <main style={{ minHeight: '80vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '500px', width: '100%', background: 'white', padding: '5rem 3rem', borderRadius: '3rem', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: '#94a3b8' }}>
                        <ShoppingBag size={48} strokeWidth={1.5} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--dark)', letterSpacing: '-0.04em' }}>Coșul tău este gol</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>Nu ai adăugat încă niciun produs. Explorează ofertele noastre pentru a găsi ce cauți.</p>
                    <Link href="/products" className="btn-premium" style={{ display: 'inline-flex', padding: '1.25rem 2.5rem' }}>
                        Mergi la Produse <ArrowRight size={18} style={{ marginLeft: '0.75rem' }} />
                    </Link>
                </div>
            </main>
        );
    }

    const shippingCost = total >= 500 ? 0 : 19.99;
    const finalTotal = total + shippingCost;

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '6rem', paddingBottom: '10rem' }}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.05em', margin: 0 }}>Coșul Tău</h1>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 900 }}>{cart.length} Produse</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 450px', gap: '4rem' }} className="cart-grid">
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cart.map((item) => (
                            <div key={item.sku} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '2.5rem', padding: '2rem', display: 'flex', gap: '2rem', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="cart-item">
                                <div style={{ width: '160px', height: '160px', background: '#f8fafc', borderRadius: '1.5rem', padding: '1rem', flexShrink: 0, border: '1px solid #f1f5f9' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)', margin: 0, lineHeight: 1.2 }}>{item.name}</h3>
                                            <button 
                                                onClick={() => removeItem(item.sku)}
                                                style={{ border: 'none', background: '#fef2f2', color: '#ef4444', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                className="remove-btn"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>SKU: {item.sku}</div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                                            <button 
                                                onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                                                style={{ border: 'none', background: 'white', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: 'var(--dark)' }}
                                            >
                                                <Minus size={16} strokeWidth={2.5} />
                                            </button>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 900, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                                                style={{ border: 'none', background: 'white', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: 'var(--dark)' }}
                                            >
                                                <Plus size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--dark)' }}>
                                            {(item.price * item.quantity).toFixed(2)} Lei
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Summary */}
                    <aside>
                        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '3rem', padding: '3rem', position: 'sticky', top: '120px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>Sumar Comandă</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>
                                    <span>Subtotal</span>
                                    <span style={{ color: 'var(--dark)', fontWeight: 800 }}>{total.toFixed(2)} Lei</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>
                                    <span>Livrare</span>
                                    {shippingCost === 0 ? (
                                        <span style={{ color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 900 }}>GRATUIT</span>
                                    ) : (
                                        <span style={{ color: 'var(--dark)', fontWeight: 800 }}>{shippingCost.toFixed(2)} Lei</span>
                                    )}
                                </div>
                                {total < 500 && (
                                    <div style={{ background: '#fffbeb', color: '#92400e', borderRadius: '1rem', padding: '1rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Truck size={18} />
                                        Mai adaugă {(500 - total).toFixed(2)} Lei pentru transport gratuit!
                                    </div>
                                )}
                            </div>

                            <div style={{ height: '1px', background: '#f1f5f9', margin: '2.5rem 0' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.05em' }}>{finalTotal.toFixed(2)} Lei</span>
                            </div>

                            <Link 
                                href="/checkout" 
                                className="btn-premium" 
                                style={{ 
                                    width: '100%', 
                                    padding: '1.5rem', 
                                    fontSize: '1.1rem', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '1rem',
                                    boxShadow: '0 20px 40px -10px var(--primary-shadow)'
                                }}
                            >
                                CONTINUĂ LA CHECKOUT <ArrowRight size={20} />
                            </Link>

                            <div style={{ marginTop: '2.5rem', display: 'grid', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    <ShieldCheck size={18} color="#10b981" />
                                    Plată 100% Securizată
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    <CreditCard size={18} color="#10b981" />
                                    Acceptăm Card, Transfer sau Ramburs
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 1200px) {
                    .cart-grid { grid-template-columns: 1fr !important; }
                    aside { position: static !important; }
                }
                @media (max-width: 640px) {
                    .cart-item { flex-direction: column !important; padding: 1.5rem !important; gap: 1.5rem !important; border-radius: 2rem !important; }
                    .cart-item > div:first-child { width: 100% !important; height: auto !important; aspect-ratio: 1 !important; }
                    h1 { fontSize: 3rem !important; }
                }
                .remove-btn:hover { background: #fee2e2 !important; transform: scale(1.1); }
            `}} />
        </main>
    );
}
