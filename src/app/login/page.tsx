"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Mail, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!email) return;
        setLoading(true);

        try {
            // Simplified login: just set a cookie via API
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.ok) router.push('/account');
            else alert("Eroare la autentificare.");
        } catch(e) { alert("Eroare de conexiune."); }
        finally { setLoading(false); }
    };

    return (
        <main style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{ padding: '10rem 0', display: 'flex', justifyContent: 'center' }}>
                <div style={{ 
                    background: 'white', 
                    padding: '4rem', 
                    borderRadius: 'var(--radius-2xl)', 
                    border: '1px solid var(--border)', 
                    boxShadow: 'var(--shadow-xl)',
                    maxWidth: '500px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--bg-soft)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <Mail size={32} />
                    </div>
                    
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800 }}>Contul <span className="gradient-text">Tău</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Introdu adresa de email folosită la comandă pentru a vedea istoricul și facturile tale.</p>
                    
                    <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Adresa de Email</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="ex: nume@email.ro" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '1rem', 
                                border: '1px solid var(--border)', 
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1.1rem',
                                outline: 'none',
                                marginBottom: '2rem'
                            }} 
                        />
                        
                        <button 
                            disabled={loading}
                            className="btn-premium" 
                            style={{ 
                                width: '100%', 
                                padding: '1.25rem', 
                                fontSize: '1.1rem',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Se autentifică...' : 'Accesează Contul'} 
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'grid', gap: '1.5rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <ShieldCheck size={20} color="var(--success)" /> 
                            <span>Acces securizat la istoricul comenzilor.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <ShoppingBag size={20} color="var(--primary)" /> 
                            <span>Făcut special pentru clienții noștri premium.</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
