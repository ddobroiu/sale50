import React from 'react';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: "Termeni și Condiții | MODERNSHOP",
    description: "Termenii și condițiile de utilizare a platformei MODERNSHOP.",
};

export default function TermeniPage() {
    return (
        <main style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '8rem' }}>
                <div style={{ 
                    maxWidth: '900px', 
                    margin: '0 auto', 
                    background: 'white', 
                    padding: '4rem', 
                    borderRadius: 'var(--radius-2xl)', 
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Termeni și Condiții</h1>
                    
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
                        <p style={{ color: '#991b1b', fontWeight: 700, marginBottom: '0.5rem' }}>Date Identificare Companie:</p>
                        <p style={{ fontSize: '0.9rem', color: '#b91c1c', lineHeight: 1.6 }}>
                            <strong>Operator:</strong> CULOAREA DIN VIATA SA SRL | <strong>CUI:</strong> RO44820819 | <strong>Reg. Com:</strong> J20/1108/2021<br />
                            <strong>Sediu:</strong> Sat Topliceni, Buzău, România | <strong>Contact:</strong> contact@shopprint.ro
                        </p>
                    </div>

                    <div className="legal-content" style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
                        <h2 style={h2Style}>1. Introducere</h2>
                        <p style={pStyle}>Prezenții Termeni și Condiții definesc regulile de utilizare a site-ului MODERNSHOP. Prin accesarea sau utilizarea site-ului, sunteți de acord cu aceste reguli în totalitate.</p>

                        <h2 style={h2Style}>2. Plasarea Comenzilor</h2>
                        <p style={pStyle}>Orice comandă plasată pe site reprezintă un contract la distanță între vânzător și cumpărător. Prețurile afișate pe site includ TVA (21%), conform legislației în vigoare.</p>

                        <h2 style={h2Style}>3. Livrarea Produselor</h2>
                        <p style={pStyle}>Livrarea se realizează prin curier rapid (DPD) în termen de 24-48 ore de la confirmarea comenzii. Costul transportului este calculat automat în pagina de Checkout.</p>

                        <h2 style={h2Style}>4. Dreptul de Retur</h2>
                        <p style={pStyle}>Conform OUG 34/2014, consumatorul are dreptul de a se retrage din contract în termen de 14 zile calendaristice, fără a preciza motivele. Produsele personalizate (dacă există) fac excepție de la dreptul de retur conform art. 16 lit. c.</p>

                        <h2 style={h2Style}>5. Garanții</h2>
                        <p style={pStyle}>Toate produsele beneficiază de garanție de conformitate conform Legii 449/2003 pe o perioadă de 24 de luni. Pentru orice problemă legată de calitate, vă rugăm să ne contactați la contact@shopprint.ro.</p>

                        <h2 style={h2Style}>6. Litigii</h2>
                        <p style={pStyle}>Orice litigiu apărut între Clienți și Vânzător va fi rezolvat pe cale amiabilă. În cazul în care nu s-a reușit stingerea conflictului pe cale amiabilă, competența revine instanțelor de judecată române.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

const h2Style: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--dark)' };
const pStyle: React.CSSProperties = { marginBottom: '1.5rem', opacity: 0.85 };
