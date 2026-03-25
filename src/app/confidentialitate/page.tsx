import React from 'react';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: "Politica de Confidențialitate | MODERNSHOP",
    description: "Cum protejăm și colectăm datele tale personale conform GDPR.",
};

export default function ConfidentialitatePage() {
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
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Politica de Confidențialitate (GDPR)</h1>
                    
                    <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
                        <p style={{ color: '#166534', fontWeight: 700, marginBottom: '0.5rem' }}>Angajamentul Nostru:</p>
                        <p style={{ fontSize: '0.9rem', color: '#15803d', lineHeight: 1.6 }}>
                            Protecția datelor tale este prioritară. Respectăm Regulamentul (UE) 2016/679 (GDPR) și ne asigurăm că informațiile tale sunt procesate în siguranță și doar în scopurile declarate.
                        </p>
                    </div>

                    <div className="legal-content" style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
                        <h2 style={h2Style}>1. Ce Date Colectăm?</h2>
                        <p style={pStyle}>Colectăm datele necesare procesării comenzilor: nume, prenume, adresa de livrare, număr de telefon și adresa de email. De asemenea, colectăm date tehnice (IP, cookies) pentru funcționarea site-ului.</p>

                        <h2 style={h2Style}>2. Scopul Prelucrării</h2>
                        <p style={pStyle}>Datele tale sunt folosite exclusiv pentru: livrarea produselor comandate, facturare (obligație legală), comunicarea statusului comenzii și, opțional, newsletter (doar cu acordul tău).</p>

                        <h2 style={h2Style}>3. Destinatarii Datelor</h2>
                        <p style={pStyle}>Pentru a finaliza comanda, partajăm datele tale cu: firma de curierat (DPD), procesatorul de plăți (dacă e cazul) și serviciul de facturare (Oblio).</p>

                        <h2 style={h2Style}>4. Perioada de Stocare</h2>
                        <p style={pStyle}>Datele fiscale sunt păstrate conform legii timp de 10 ani. Datele de cont sunt păstrate până la solicitarea ștergerii acestora de către utilizator.</p>

                        <h2 style={h2Style}>5. Drepturile Tale</h2>
                        <p style={pStyle}>Conform GDPR, ai dreptul la: acces, rectificare, ștergere ("dreptul de a fi uitat"), restricționarea prelucrării și portabilitatea datelor. Pentru exercitarea acestor drepturi, scrie-ne la contact@shopprint.ro.</p>

                        <h2 style={h2Style}>6. Securitate</h2>
                        <p style={pStyle}>Utilizăm protocoale de securitate standard (SSL/HTTPS) pentru a proteja transferul de date între browserul tău și serverele noastre.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

const h2Style: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--dark)' };
const pStyle: React.CSSProperties = { marginBottom: '1.5rem', opacity: 0.85 };
