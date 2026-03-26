"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Camera, Package, Tag, Layers, X, Save } from 'lucide-react';

type Product = {
    sku: string;
    name: string;
    image: string;
    category: string;
    priceWithoutVat: number;
    stock: number;
    brand: string;
    description: string;
    ean: string;
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selCategory, setSelCategory] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProd, setEditProd] = useState<Partial<Product> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    async function load() {
        setLoading(true);
        const params = new URLSearchParams({ 
            page: page.toString(), 
            search, 
            category: selCategory 
        });
        const res = await fetch(`/api/admin/products?${params.toString()}`);
        if (res.status === 401) {
            window.location.href = "/admin/login";
            return;
        }
        const data = await res.json();
        if (data.ok) {
            setProducts(data.products);
            setTotalPages(data.totalPages);
        }
        setLoading(false);
    }

    async function loadCats() {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.ok) setCategories(data.categories);
    }

    useEffect(() => { load(); }, [page, search, selCategory]);
    useEffect(() => { loadCats(); }, []);

    async function onSave(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        const method = editProd?.sku && products.some(p => p.sku === editProd.sku) ? "PUT" : "POST";
        const res = await fetch("/api/admin/products", {
            method,
            body: JSON.stringify(editProd)
        });
        if (res.ok) {
            setIsModalOpen(false);
            load();
            loadCats();
        }
        setIsSaving(false);
    }

    async function onDelete(sku: string) {
        if (!confirm("Sigur ștergi produsul?")) return;
        const res = await fetch(`/api/admin/products?sku=${sku}`, { method: 'DELETE' });
        if (res.ok) load();
    }

    return (
        <div style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Produse Shop</h1>
                    <p style={{ opacity: 0.6 }}>Gestionează stocul, prețurile și categoriile.</p>
                </div>
                <button 
                    onClick={() => { setEditProd({}); setIsModalOpen(true); }}
                    style={{ background: '#3b82f6', color: 'white', padding: '1rem 2rem', borderRadius: '14px', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(59,130,246,0.3)' }}
                >
                    <Plus size={20} /> ADAUGĂ PRODUS
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input 
                        type="text" 
                        placeholder="Caută după nume sau SKU..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }}
                    />
                </div>
                <select 
                    value={selCategory}
                    onChange={e => setSelCategory(e.target.value)}
                    style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', minWidth: '200px' }}
                >
                    <option value="">Toate Categoriile</option>
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
                </select>
            </div>

            <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>PRODUS</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>SKU</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>CATEGORIE</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>STOC</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b' }}>PREȚ</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'right' }}>ACȚIUNI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.sku} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                                                <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <span style={{ fontWeight: 900, color: '#1e293b' }}>{p.sku}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>{p.category}</span>
                                    </td>
                                <td style={{ padding: '1.25rem 2rem' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: p.stock > 0 ? '#10b981' : '#ef4444' }}>{p.stock}</div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{p.priceWithoutVat.toFixed(2)} Lei</div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => { setEditProd(p); setIsModalOpen(true); }} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', color: '#475569' }}><Edit2 size={16} /></button>
                                        <button onClick={() => onDelete(p.sku)} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#fef2f2', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Anterior</button>
                <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>Pagina {page} din {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>Următor</button>
            </div>

            {/* Modal Edit/Add */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '2.5rem', padding: '3rem', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                        
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>{editProd?.sku ? "Editează Produs" : "Adaugă Produs Nou"}</h2>

                        <form onSubmit={onSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <label style={labStyle}>SKU Produs (Unic)
                                    <input required disabled={!!editProd?.sku && products.some(p => p.sku === editProd.sku)} value={editProd?.sku || ""} onChange={e => setEditProd({...editProd, sku: e.target.value})} style={inpStyle} />
                                </label>
                                <label style={labStyle}>Nume Produs
                                    <input required value={editProd?.name || ""} onChange={e => setEditProd({...editProd, name: e.target.value})} style={inpStyle} />
                                </label>
                                <label style={labStyle}>Categorie
                                    <input required list="cats" value={editProd?.category || ""} onChange={e => setEditProd({...editProd, category: e.target.value})} style={inpStyle} />
                                    <datalist id="cats">
                                        {categories.map(c => <option key={c.name} value={c.name} />)}
                                    </datalist>
                                </label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label style={labStyle}>Preț Fără TVA
                                        <input required type="number" step="0.01" value={editProd?.priceWithoutVat || ""} onChange={e => setEditProd({...editProd, priceWithoutVat: parseFloat(e.target.value)})} style={inpStyle} />
                                    </label>
                                    <label style={labStyle}>Stoc
                                        <input required type="number" value={editProd?.stock || ""} onChange={e => setEditProd({...editProd, stock: parseInt(e.target.value)})} style={inpStyle} />
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <label style={labStyle}>URL Imagine Principală
                                    <input required value={editProd?.image || ""} onChange={e => setEditProd({...editProd, image: e.target.value})} style={inpStyle} />
                                </label>
                                <label style={labStyle}>Brand
                                    <input value={editProd?.brand || ""} onChange={e => setEditProd({...editProd, brand: e.target.value})} style={inpStyle} />
                                </label>
                                <label style={labStyle}>Cod EAN
                                    <input value={editProd?.ean || ""} onChange={e => setEditProd({...editProd, ean: e.target.value})} style={inpStyle} />
                                </label>
                                <label style={labStyle}>Descriere
                                    <textarea rows={3} value={editProd?.description || ""} onChange={e => setEditProd({...editProd, description: e.target.value})} style={{...inpStyle, resize: 'none'}} />
                                </label>
                            </div>

                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="submit" disabled={isSaving} style={{ background: '#3b82f6', color: 'white', padding: '1rem 3rem', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {isSaving ? "SE SALVEAZĂ..." : "SALVEAZĂ PRODUSUL"} <Save size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const labStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b'
};

const inpStyle: React.CSSProperties = {
    padding: '0.9rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', color: '#1e293b', fontSize: '0.95rem'
};
