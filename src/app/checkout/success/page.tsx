"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, ShoppingBag, Mail } from "lucide-react";
import ReactConfetti from "react-confetti";

export default function SuccessPage() {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '10rem', paddingBottom: '10rem' }}>
            <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} gravity={0.15} colors={['#10b981', '#3b82f6', '#f59e0b']} />
            
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '5rem 3rem', borderRadius: '3rem', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '100px', height: '100px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: '#10b981', animation: 'scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <CheckCircle size={60} strokeWidth={2.5} />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--dark)', letterSpacing: '-0.04em' }}>Comandă Finalizată!</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '3rem' }}>
                        Mulțumim pentru încredere! Comanda ta a fost înregistrată cu succes sub numărul <span style={{ color: 'var(--primary)', fontWeight: 800 }}>#{typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('orderId') : ''}</span> și procesarea a început deja.
                    </p>

                    <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '2rem', padding: '2.5rem', marginBottom: '4rem', display: 'grid', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'left' }}>
                            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--dark)' }}>Confirmare pe email</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Ți-am trimis detaliile comenzii pe adresa de email.</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'left' }}>
                            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                                <Package size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--dark)' }}>Pregătire pentru expediere</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Vei primi un nou email cu numărul de AWB imediat ce coletul pleacă spre tine.</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/products" className="btn-premium" style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                            <ShoppingBag size={20} />
                            CONTINUĂ CUMPĂRĂTURILE
                            <ArrowRight size={18} />
                        </Link>
                        <Link href="/" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none', padding: '1rem' }}>Înapoi la pagina principală</Link>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scaleUp {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}} />
        </main>
    );
}
