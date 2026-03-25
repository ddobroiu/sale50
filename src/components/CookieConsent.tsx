"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

declare global {
    interface Window {
        dataLayer: any[];
    }
}

export default function CookieConsent() {
    const [consentStatus, setConsentStatus] = useState<"granted" | "denied" | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("cookie_consent");
        if (stored === "granted" || stored === "denied") {
            setConsentStatus(stored);
        } else {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "granted");
        setConsentStatus("granted");
        setIsVisible(false);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'cookie_consent_granted' });
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "denied");
        setConsentStatus("denied");
        setIsVisible(false);
    };

    return (
        <>
            {consentStatus === "granted" && (
                <>
                    {/* Google Analytics (Placeholder) */}
                    {/* <Script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
                        strategy="afterInteractive"
                    /> */}
                </>
            )}

            {isVisible && (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999, padding: '1.5rem', pointerEvents: 'none' }}>
                    <div style={{ 
                        maxWidth: '450px', 
                        margin: '0 auto', 
                        background: 'rgba(255, 255, 255, 0.95)', 
                        backdropFilter: 'blur(20px)', 
                        border: '1px solid var(--border-color)', 
                        boxShadow: 'var(--shadow-xl)', 
                        padding: '1.5rem', 
                        borderRadius: '2rem', 
                        pointerEvents: 'auto' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ padding: '0.5rem', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '50%' }}>
                                    <Cookie size={20} />
                                </div>
                                <h3 style={{ fontWeight: 800, color: 'var(--dark)', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Setări Cookies</h3>
                            </div>
                            <button onClick={handleDecline} style={{ color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            Folosim cookie-uri pentru a-ți personaliza experiența, a analiza traficul și pentru a asigura funcționarea coșului de cumpărături pe sale50.ro. Poți alege să accepți doar cookie-urile strict necesare. Mai multe informații în <Link href="/cookies" style={{ color: 'var(--primary)', fontWeight: 600 }}>Politica de Cookies</Link>.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button
                                onClick={handleDecline}
                                style={{ 
                                    padding: '0.75rem', 
                                    borderRadius: '1rem', 
                                    border: '1px solid var(--border-color)', 
                                    background: 'white', 
                                    color: 'var(--text-main)', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer' 
                                }}
                            >
                                Strict Necesare
                            </button>
                            <button
                                onClick={handleAccept}
                                style={{ 
                                    padding: '0.75rem', 
                                    borderRadius: '1rem', 
                                    background: 'var(--primary)', 
                                    color: 'white', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer',
                                    border: 'none',
                                    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)' 
                                }}
                            >
                                Acceptă Toate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
