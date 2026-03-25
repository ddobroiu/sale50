"use client";
import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, ShoppingBag, Lock } from 'lucide-react';
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
        <main style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
            minHeight: 'calc(100vh - var(--nav-height))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(20px)',
                padding: '3.5rem', 
                borderRadius: 'var(--radius-2xl)', 
                border: '1px solid rgba(255, 255, 255, 0.5)', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                animation: 'fadeInUp 0.6s ease-out'
            }}>
                <div style={{ width: '72px', height: '72px', background: 'var(--primary)', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>
                    <Lock size={32} />
                </div>
                
                <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--dark)' }}>
                    Portal <span style={{ color: 'var(--primary)' }}>Clienți</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Accesează-ți comenzile, facturile și istoricul premium direct dintr-un singur loc folosind email-ul tău.
                </p>
                
                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '0.5rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Email de autentificare
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                                <Mail size={18} />
                            </div>
                            <input 
                                type="email" 
                                required 
                                placeholder="ex: nume@email.ro" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    padding: '1rem 1rem 1rem 3rem', 
                                    border: '1px solid var(--border-color)', 
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: 'white',
                                    transition: 'all 0.2s'
                                }} 
                                className="login-input"
                            />
                        </div>
                    </div>
                    
                    <button 
                        disabled={loading}
                        className="btn btn-primary" 
                        style={{ 
                            width: '100%', 
                            padding: '1.1rem', 
                            fontSize: '1rem',
                            opacity: loading ? 0.7 : 1,
                            borderRadius: 'var(--radius-lg)'
                        }}
                    >
                        {loading ? 'Se procesează...' : 'Autentifică-te'} 
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <ShieldCheck size={20} color="var(--success)" /> 
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)' }}>Securitate</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Date criptate end-to-end</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <ShoppingBag size={20} color="var(--primary)" /> 
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)' }}>Comenzi</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status livrare în timp real</span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .login-input:focus {
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 576px) {
                    main { padding: 1rem; }
                    div[style*="padding: 3.5rem"] { padding: 2rem !important; }
                }
            `}} />
        </main>
    );
}
