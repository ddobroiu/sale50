"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Truck, FileText, ExternalLink, Calendar, User, Phone, Mail, MapPin, Loader2 } from 'lucide-react';

type Order = {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
    shipping_fee: number;
    status: string;
    payment_method: string;
    invoice_url: string;
    awb_number: string;
    awb_carrier: string;
    created_at: string;
    shipping_address: any;
    items: any;
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAwb, setLoadingAwb] = useState<string | null>(null);

    async function updateStatus(id: string, newStatus: string) {
        const res = await fetch(`/api/admin/orders/${id}/status`, {
            method: 'POST',
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
            load();
        } else {
            alert("Eroare la schimbarea statusului");
        }
    }

    async function load() {
        const res = await fetch("/api/admin/orders");
        if (res.status === 401) {
            window.location.href = "/admin/login";
            return;
        }
        const data = await res.json();
        if (data.ok) setOrders(data.orders);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function generateAwb(id: string) {
        setLoadingAwb(id);
        const res = await fetch(`/api/admin/orders/${id}/awb`, { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            alert(`AWB ${data.awb} generat cu succes!`);
            load();
        } else {
            alert("EROARE: " + (data.error || "Nu am putut genera AWB-ul. Verifică datele de livrare."));
        }
        setLoadingAwb(null);
    }

    const fmt = (v: number) => new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(v);

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Se încarcă comenzile...</div>;

    return (
        <div style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Gestionare Comenzi</h1>
                    <p style={{ opacity: 0.6, fontSize: '1.1rem', marginTop: '0.25rem' }}>Monitorizează și prelucrează toate comenzile din shop.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order.id} style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>#{order.id}</span>
                                    <select 
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        style={{ 
                                            background: order.status === 'pending' ? '#fff7ed' : order.status === 'expediata' ? '#eff6ff' : order.status === 'livrata' ? '#f0fdf4' : '#fef2f2', 
                                            color: order.status === 'pending' ? '#c2410c' : order.status === 'expediata' ? '#1d4ed8' : order.status === 'livrata' ? '#166534' : '#b91c1c', 
                                            padding: '0.25rem 0.5rem', 
                                            borderRadius: '50px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 800, 
                                            textTransform: 'uppercase',
                                            border: 'none',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="pending">În așteptare</option>
                                        <option value="expediata">Expediată</option>
                                        <option value="livrata">Livrată</option>
                                        <option value="anulata">Anulată</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShoppingBag size={14} /> {fmt(order.total_amount)}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {order.invoice_url && (
                                    <a href={order.invoice_url} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#f1f5f9', borderRadius: '10px', color: '#475569', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                                        <FileText size={16} /> FACTURĂ <ExternalLink size={12} />
                                    </a>
                                )}
                                {order.awb_number ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#f0fdf4', borderRadius: '10px', color: '#166534', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <Truck size={16} /> {order.awb_carrier}: {order.awb_number}
                                        </div>
                                        <a href={`/api/admin/orders/${order.id}/awb/print`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', background: '#f1f5f9', borderRadius: '10px', color: '#475569' }}>
                                            <FileText size={18} />
                                        </a>
                                        <a href={`https://services.dpd.ro/tracking/?shipmentNumber=${order.awb_number}`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', background: '#f1f5f9', borderRadius: '10px', color: '#475569' }}>
                                            <Truck size={18} />
                                        </a>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => generateAwb(order.id)}
                                        disabled={loadingAwb === order.id}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#3b82f6', borderRadius: '10px', color: 'white', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', opacity: loadingAwb === order.id ? 0.7 : 1 }}
                                    >
                                        {loadingAwb === order.id ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />} 
                                        {loadingAwb === order.id ? 'SE GENEREAZĂ...' : 'GENEREAZĂ AWB'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', color: '#94a3b8' }}>Client & Livrare</h4>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><User size={16} color="#64748b" /> <strong>{order.customer_name}</strong></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Phone size={16} color="#64748b" /> {order.customer_phone}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Mail size={16} color="#64748b" /> {order.customer_email}</div>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        <MapPin size={16} color="#64748b" style={{ marginTop: '0.2rem' }} /> 
                                        <span>
                                            {order.shipping_address?.judet}, {order.shipping_address?.localitate}<br/>
                                            {order.shipping_address?.strada_nr}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', color: '#94a3b8' }}>Produse</h4>
                                <div style={{ display: 'grid', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '1rem' }}>
                                    {order.items?.map((it: any, i: number) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                            <span>{it.quantity}x {it.name}</span>
                                            <span style={{ fontWeight: 700 }}>{fmt(it.price * it.quantity)}</span>
                                        </div>
                                    ))}
                                    <div style={{ height: '1px', background: '#e2e8f0', margin: '0.25rem 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                                        <span>TOTAL</span>
                                        <span>{fmt(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
