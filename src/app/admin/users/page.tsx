"use client";
import React, { useEffect, useState } from 'react';
import { Users, Mail, ShoppingBag, TrendingUp, Calendar, Search } from 'lucide-react';

type UserStat = {
    id: string;
    email: string;
    name: string;
    created_at: string;
    order_count: number;
    total_spent: number;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch("/api/admin/users");
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            const data = await res.json();
            if (data.ok) setUsers(data.users);
            setLoading(false);
        }
        load();
    }, []);

    const filtered = users.filter(u => 
        u.email.toLowerCase().includes(search.toLowerCase()) || 
        u.name?.toLowerCase().includes(search.toLowerCase())
    );

    const fmt = (v: number) => new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(v);

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Se încarcă utilizatorii...</div>;

    return (
        <div style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Utilizatori</h1>
                    <p style={{ opacity: 0.6, fontSize: '1.1rem', marginTop: '0.25rem' }}>Lista de clienți înregistrați în baza de date.</p>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '500px' }}>
                <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input 
                    type="text" 
                    placeholder="Caută după nume sau email..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}
                />
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>UTILIZATOR</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>EMAIL</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>COMENZI</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>TOTAL CHELTUIT</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>DATA ÎNSCRIERII</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="hover:bg-slate-50">
                                <td style={{ padding: '1.25rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#e0f2fe', color: '#0369a1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                            {u.name?.charAt(0) || 'U'}
                                        </div>
                                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{u.name || 'Utilizator'}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={14} /> {u.email}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                        <ShoppingBag size={14} color="#64748b" /> {u.order_count}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#10b981' }}>
                                        <TrendingUp size={14} /> {fmt(u.total_spent)}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} /> {new Date(u.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
