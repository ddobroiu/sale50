import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getOrdersByEmail } from '@/lib/products';
import { Package, Calendar, Download, ShoppingBag, ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';

import LogoutButton from '@/components/LogoutButton';

export default async function AccountPage() {
    const cookieStore = await cookies();
    const email = cookieStore.get("client_auth")?.value;

    if (!email) {
        redirect("/login");
    }

    const orders = await getOrdersByEmail(email);

    return (
        <main style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <Navbar />
            
            <div className="container" style={{ padding: '4rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Contul <span className="gradient-text">Tău</span></h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Ești autentificat cu: <strong>{email}</strong></p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '3rem', alignItems: 'start' }}>
                    
                    {/* ORDERS LIST */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {orders.length === 0 ? (
                            <div style={{ background: 'white', padding: '4rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border)' }}>
                                <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Nu ai nicio comandă încă.</h3>
                                <Link href="/products" className="btn-premium" style={{ display: 'inline-flex' }}>Mergi la Cumpărături</Link>
                            </div>
                        ) : (
                            orders.map((order: any) => {
                                const items = JSON.parse(order.items || '[]');
                                return (
                                    <div key={order.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-soft)' }}>
                                            <div style={{ display: 'flex', gap: '2rem' }}>
                                                <div>
                                                    <label style={labelStyle}>COMANDĂ</label>
                                                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>#{order.id}</div>
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>DATA</label>
                                                    <div style={{ fontWeight: 600 }}>{new Date(order.created_at).toLocaleDateString('ro-RO')}</div>
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>TOTAL</label>
                                                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{order.total_amount.toFixed(2)} Lei</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <span style={{ 
                                                    padding: '0.4rem 1rem', 
                                                    background: order.status === 'pending' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)', 
                                                    color: order.status === 'pending' ? '#a16207' : '#16a34a',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase'
                                                }}>{order.status === 'pending' ? 'În așteptare' : 'Finalizată'}</span>
                                            </div>
                                        </div>

                                        <div style={{ padding: '2rem' }}>
                                            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                                {items.map((it: any, i: number) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                            <div style={{ width: '40px', height: '40px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }}>
                                                                <img src={it.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            </div>
                                                            <span style={{ fontWeight: 600 }}>{it.quantity}x</span> {it.name}
                                                        </div>
                                                        <span style={{ fontWeight: 700 }}>{(it.price * it.quantity).toFixed(2)} Lei</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {order.invoice_url && (
                                                    <a href={order.invoice_url} target="_blank" style={{ 
                                                        display: 'inline-flex', 
                                                        alignItems: 'center', 
                                                        gap: '0.5rem', 
                                                        padding: '0.75rem 1.5rem', 
                                                        border: '1px solid var(--border)',
                                                        borderRadius: 'var(--radius-md)',
                                                        color: 'var(--dark)',
                                                        fontWeight: 700,
                                                        fontSize: '0.9rem',
                                                        transition: 'all 0.2s'
                                                    }} className="glass-hover">
                                                        <Download size={18} /> Descarcă Factura (Oblio)
                                                    </a>
                                                )}
                                                <button style={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.5rem', 
                                                    padding: '0.75rem 1.5rem', 
                                                    background: 'var(--dark)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontWeight: 700,
                                                    fontSize: '0.9rem'
                                                }}>
                                                    <ExternalLink size={18} /> Urmărire DPD
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* SIDEBAR TOOLS */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Gestionare Cont</h3>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

const labelStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
    display: 'block'
};
