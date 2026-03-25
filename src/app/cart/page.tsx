"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/components/CartContext';
import { Plus, Minus, ShieldCheck, ArrowRight, ShoppingBag, X, CheckCircle2, Lock, Truck } from 'lucide-react';
import JudetSelector from '@/components/JudetSelector';
import LocalitateSelector from '@/components/LocalitateSelector';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeItem, updateQuantity, total, clearCart } = useCart();
    
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [judet, setJudet] = useState('');
    const [localitate, setLocalitate] = useState('');
    const [address, setAddress] = useState('');
    const [zip, setZip] = useState('');

    const [billingType, setBillingType] = useState<'pf' | 'pj'>('pf');
    const [companyName, setCompanyName] = useState('');
    const [cui, setCui] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name || !email || !phone || !judet || !localitate || !address) {
            alert("Te rugăm să completezi toate datele de livrare obligatorii.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, email, phone,
                    shipping: { judet, localitate, address, zip },
                    billing: { type: billingType, companyName, cui },
                    items: cart,
                    total: total
                })
            });
            const data = await res.json();
            if (data.ok) {
                setOrderSuccess(data.orderId);
                clearCart();
            } else { alert("Eroare la procesarea comenzii: " + data.message); }
        } catch (e) { alert("Eroare de conexiune la server."); }
        finally { setLoading(false); }
    };

    if (orderSuccess) {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                    <div style={{ 
                        maxWidth: '600px', 
                        margin: '0 auto', 
                        background: 'white', 
                        padding: '4rem', 
                        borderRadius: 'var(--radius-2xl)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'var(--primary-soft)', 
                            color: 'var(--primary)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 2rem' 
                        }}>
                            <CheckCircle2 size={40} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Comandă Confirmată!</h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
                            Mulțumim pentru încredere! ID-ul comenzii tale este <strong style={{ color: 'var(--dark)' }}>#{orderSuccess}</strong>. 
                            Vei primi un email de confirmare și factura în câteva momente. 
                        </p>
                        <Link href="/" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                            Înapoi la magazin <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div className="container" style={{ padding: '12rem 0', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--bg-white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid var(--border-color)' }}>
                        <ShoppingBag size={32} color="var(--text-light)" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Coșul tău este gol</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Se pare că nu ai adăugat niciun produs în coș încă.</p>
                    <Link href="/products" className="btn btn-primary">Descoperă Ofertele Noastre</Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '8rem' }}>
            <Navbar />
            
            <div className="container" style={{ paddingTop: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '4rem', alignItems: 'start' }} className="checkout-grid">
                    
                    {/* LEFTSIDE: CHECKOUT FORM */}
                    <div style={{ 
                        background: 'white', 
                        padding: '3.5rem', 
                        borderRadius: 'var(--radius-2xl)', 
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                             <div style={{ background: 'var(--primary)', color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>1</div>
                             <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Date Expediție</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '0.95rem' }}>Te rugăm să introduci datele unde dorești să livrăm produsele.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="form-grid">
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Nume complet *</label>
                                <input type="text" placeholder="Ex: Popescu Andrei" style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mobile-full">
                                <label style={labelStyle}>E-mail *</label>
                                <input type="email" placeholder="andrei@email.ro" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="mobile-full">
                                <label style={labelStyle}>Telefon *</label>
                                <input type="tel" placeholder="07xxxxxxxx" style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <JudetSelector value={judet} onChange={setJudet} />
                            <LocalitateSelector judet={judet} value={localitate} onChange={setLocalitate} onPostCodeChange={setZip} />
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Adresa de livrare *</label>
                                <input type="text" placeholder="Strada, Număr, Bloc, Apartament..." style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                        </div>

                        {/* SECTION 2 */}
                        <div style={{ marginTop: '5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                 <div style={{ background: 'var(--primary)', color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>2</div>
                                 <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Informații Facturare</h2>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
                                <label style={radioContainerStyle}>
                                    <input type="radio" checked={billingType === 'pf'} onChange={() => setBillingType('pf')} style={radioInputStyle} />
                                    <span style={{ fontWeight: billingType === 'pf' ? 700 : 500 }}>Persoană Fizică</span>
                                </label>
                                <label style={radioContainerStyle}>
                                    <input type="radio" checked={billingType === 'pj'} onChange={() => setBillingType('pj')} style={radioInputStyle} />
                                    <span style={{ fontWeight: billingType === 'pj' ? 700 : 500 }}>Persoană Juridică</span>
                                </label>
                            </div>
                            
                            {billingType === 'pj' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="form-grid">
                                    <div className="mobile-full">
                                        <label style={labelStyle}>Nume Firmă</label>
                                        <input type="text" placeholder="SC EXEMPLU SRL" style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} />
                                    </div>
                                    <div className="mobile-full">
                                        <label style={labelStyle}>CUI / CIF</label>
                                        <input type="text" placeholder="RO12345678" style={inputStyle} value={cui} onChange={e => setCui(e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHTSIDE: CART SUMMARY */}
                    <div style={{ position: 'sticky', top: '120px' }}>
                        <div style={{ 
                            background: 'white', 
                            padding: '2.5rem', 
                            borderRadius: 'var(--radius-2xl)', 
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sumar Comandă</h3>
                            
                            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {cart.map(item => (
                                    <div key={item.sku} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                                        <div style={{ width: '64px', height: '64px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-md)', padding: '0.4rem', border: '1px solid var(--border-soft)', flexShrink: 0 }}>
                                            <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} style={qBtn}><Minus size={10} /></button>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} style={qBtn}><Plus size={10} /></button>
                                                </div>
                                                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{(item.price * item.quantity).toFixed(2)} Lei</span>
                                            </div>
                                        </div>
                                        <button onClick={() => removeItem(item.sku)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.2rem' }}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '2rem', display: 'grid', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <span>Subtotal</span>
                                    <span>{total.toFixed(2)} Lei</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Truck size={14} /> Transport
                                    </span>
                                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>GRATUIT</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: 800, marginTop: '1rem', color: 'var(--dark)' }}>
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} Lei</span>
                                </div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', textAlign: 'right', marginTop: '0.5rem' }}>Include TVA conform legislației în vigoare.</p>
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'grid', gap: '1rem' }}>
                                <button 
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="btn btn-primary" 
                                    style={{ width: '100%', padding: '1.25rem', opacity: loading ? 0.7 : 1 }}
                                >
                                    {loading ? 'Se finalizează...' : 'Confirma Comanda'} 
                                    {!loading && <ArrowRight size={20} />}
                                </button>
                                
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                                    <Lock size={12} /> Plată Securizată & Criptată
                                </div>
                            </div>
                        </div>
                        
                        {/* Summary Trust Badges */}
                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
                            <div style={smallTrustStyle}>
                                <CheckCircle2 size={14} color="var(--success)" />
                                <span>Garanție de returnare 14 zile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 1100px) {
                    .checkout-grid { grid-template-columns: 1fr !important; }
                    .checkout-grid > div:last-child { position: static !important; }
                }
                @media (max-width: 600px) {
                    .form-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                    .mobile-full { grid-column: span 1 !important; }
                    .checkout-grid > div:first-child { padding: 2rem !important; }
                }
            `}} />
        </main>
    );
}

const inputStyle: React.CSSProperties = { 
    width: '100%', 
    padding: '0.9rem 1.25rem', 
    background: '#f8fafc', 
    border: '1px solid var(--border-color)', 
    borderRadius: 'var(--radius-lg)',
    fontSize: '0.95rem', 
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s',
    marginTop: '0.6rem'
};
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 800, color: 'var(--dark)', letterSpacing: '0.02em' };
const qBtn: React.CSSProperties = { width: '22px', height: '22px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' };
const radioContainerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1rem' };
const radioInputStyle: React.CSSProperties = { width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' };
const smallTrustStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, justifyContent: 'center' };
