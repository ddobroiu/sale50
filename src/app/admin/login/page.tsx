"use client";
import React, { useState } from 'react';
import { Lock, Shield } from 'lucide-react';

export default function AdminLoginPage() {
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");

    async function onLogin(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/admin/login", {
            method: "POST",
            body: JSON.stringify({ pass })
        });
        const d = await res.json();
        if (d.ok) window.location.href = "/admin/orders";
        else setErr("Parolă incorectă!");
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '3rem', background: '#1e293b', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(37,99,235,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', margin: '0 auto 1.5rem' }}>
                        <Shield size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Panel</h1>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.5rem' }}>sale50.ro restricted access</p>
                </div>

                <form onSubmit={onLogin} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>Admin Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                            <input 
                                type="password" 
                                value={pass} 
                                onChange={e => setPass(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', outline: 'none' }}
                            />
                        </div>
                    </div>
                    {err && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>{err}</p>}
                    <button type="submit" style={{ padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                        AUTENTIFICARE
                    </button>
                </form>
            </div>
        </div>
    );
}
