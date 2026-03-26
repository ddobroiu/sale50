"use client";
import React, { useEffect, useState } from 'react';
import { FileText, Download, ExternalLink, Search, Calendar, User } from 'lucide-react';

type Invoice = {
    id: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    invoice_url: string;
    created_at: string;
};

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch("/api/admin/invoices");
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            const data = await res.json();
            if (data.ok) setInvoices(data.invoices);
            setLoading(false);
        }
        load();
    }, []);

    const filtered = invoices.filter(i => 
        i.id.toLowerCase().includes(search.toLowerCase()) || 
        i.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        i.customer_email.toLowerCase().includes(search.toLowerCase())
    );

    const fmt = (v: number) => new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(v);

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Se încarcă listele de factură...</div>;

    return (
        <div style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Facturi Fiscale</h1>
                    <p style={{ opacity: 0.6, fontSize: '1.1rem', marginTop: '0.25rem' }}>Arhiva completă a tuturor facturilor emise prin Oblio.</p>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '500px' }}>
                <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input 
                    type="text" 
                    placeholder="Caută după serie, client sau email..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                {filtered.map(inv => (
                    <div key={inv.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1.5rem', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} className="invoice-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ background: '#f0fdf4', color: '#166534', padding: '0.5rem', borderRadius: '10px' }}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>#{inv.id}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(inv.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b' }}>
                                {fmt(inv.total_amount)}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', color: '#1e293b', fontWeight: 700, fontSize: '0.95rem' }}>
                                <User size={14} color="#64748b" /> {inv.customer_name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                {inv.customer_email}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                            <a href={inv.invoice_url} target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', background: '#3b82f6', color: 'white', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none' }}>
                                <ExternalLink size={16} /> VEZI ONLINE
                            </a>
                            <a href={inv.invoice_url} download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem', background: '#f1f5f9', color: '#475569', borderRadius: '12px', textDecoration: 'none' }}>
                                <Download size={18} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
