import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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
            <div className="container" style={{ padding: '4rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Contul <span style={{color: 'var(--primary)'}}>Tău</span></h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>Ești autentificat cu: <strong style={{color: 'var(--dark)'}}>{email}</strong></p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '3rem', alignItems: 'start' }} className="account-grid">
                    
                    {/* ORDERS LIST */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {orders.length === 0 ? (
                            <div style={{ background: 'white', padding: '5rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--bg-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <ShoppingBag size={32} style={{ opacity: 0.2 }} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Nu ai nicio comandă încă.</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Începe să cauți produsele preferate și profită de reducerile noastre.</p>
                                <Link href="/products" className="btn btn-primary" style={{ display: 'inline-flex' }}>Mergi la Cumpărături</Link>
                            </div>
                        ) : (
                            orders.map((order: any) => {
                                // PostgreSQL stores JSONB, so it might not need JSON.parse depending on pg driver version, 
                                // but here it was stored as individual columns or JSONB. 
                                // Based on previous code, let's assume it's already an object if JSONB or needs parse if string.
                                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                                
                                return (
                                    <div key={order.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                                            <div style={{ display: 'flex', gap: '2.5rem' }} className="order-meta">
                                                <div>
                                                    <label style={labelStyle}>COMANDĂ</label>
                                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>#{order.id}</div>
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>DATA</label>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date(order.created_at).toLocaleDateString('ro-RO')}</div>
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>TOTAL</label>
                                                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>{order.total_amount.toFixed(2)} Lei</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <span style={{ 
                                                    padding: '0.4rem 1rem', 
                                                    background: order.status === 'pending' ? 'rgba(234, 179, 8, 0.1)' : order.status === 'expediata' ? 'rgba(59, 130, 246, 0.1)' : order.status === 'livrata' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                                    color: order.status === 'pending' ? '#a16207' : order.status === 'expediata' ? '#1d4ed8' : order.status === 'livrata' ? '#166534' : '#b91c1c',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {order.status === 'pending' ? 'În așteptare' : 
                                                     order.status === 'expediata' ? 'Expediată' : 
                                                     order.status === 'livrata' ? 'Livrată' : 
                                                     order.status === 'anulata' ? 'Anulată' : order.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ padding: '2rem' }}>
                                            <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                                {items.map((it: any, i: number) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                            <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: 'var(--radius-md)', padding: '0.25rem', border: '1px solid var(--border-soft)' }}>
                                                                <img src={it.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{it.name}</div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Cantitate: {it.quantity} unități</div>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontWeight: 800, color: 'var(--dark)' }}>{(it.price * it.quantity).toFixed(2)} Lei</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem' }} className="order-actions">
                                                {order.invoice_url && (
                                                    <a href={order.invoice_url} target="_blank" style={actionBtnStyle}>
                                                        <Download size={16} /> Factură
                                                    </a>
                                                )}
                                                {order.awb_number && (
                                                    <a 
                                                        href={`https://www.dpd.com/ro/ro/tracking/?parcelNumber=${order.awb_number}`} 
                                                        target="_blank" 
                                                        style={{ ...actionBtnStyle, background: 'var(--dark)', color: 'white', borderColor: 'var(--dark)' }}
                                                    >
                                                        <ExternalLink size={16} /> Status DPD
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* SIDEBAR TOOLS */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Package size={20} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Gestionare Cont</h3>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>Modifică datele de livrare, verifică statusul plăților sau deconectează-te în siguranță.</p>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 992px) {
                    .account-grid { grid-template-columns: 1fr !important; }
                    .order-meta { flex-wrap: wrap; gap: 1rem !important; }
                    .order-actions { flex-direction: column; }
                    .order-actions > * { width: 100%; justify-content: center; }
                }
            `}} />
        </main>
    );
}

const labelStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--text-light)',
    letterSpacing: '0.1em',
    marginBottom: '0.2rem',
    display: 'block',
    textTransform: 'uppercase'
};

const actionBtnStyle: React.CSSProperties = {
    display: 'inline-flex', 
    alignItems: 'center', 
    gap: '0.6rem', 
    padding: '0.75rem 1.5rem', 
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--dark)',
    fontWeight: 700,
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    textDecoration: 'none',
    cursor: 'pointer'
};
