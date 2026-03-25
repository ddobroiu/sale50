import React from 'react';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: "Politica de Cookies | MODERNSHOP",
    description: "Informații despre utilizarea fișierelor de tip cookie pe site-ul MODERNSHOP.",
};

export default function CookiesPage() {
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
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Politica de Cookies</h1>
                    
                    <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
                        <p style={{ color: '#854d0e', fontWeight: 700, marginBottom: '0.5rem' }}>Informație Legală:</p>
                        <p style={{ fontSize: '0.9rem', color: '#a16207', lineHeight: 1.6 }}>
                            Această politică detaliază modul în care folosim cookies și tehnologii similare pentru a-ți oferi o experiență personalizată și sigură pe MODERNSHOP.
                        </p>
                    </div>

                    <div className="legal-content" style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
                        <h2 style={h2Style}>1. Ce sunt Cookies?</h2>
                        <p style={pStyle}>Cookies sunt fișiere text de mici dimensiuni stocate pe dispozitivul tău (computer, tabletă sau telefon) atunci când vizitezi un site web. Acestea permit site-ului să-ți recunoască dispozitivul și să rețină anumite informații despre preferințele tale sau acțiunile trecute.</p>

                        <h2 style={h2Style}>2. Cookies Esențiale</h2>
                        <p style={pStyle}>Acestea sunt strict necesare pentru funcționarea site-ului. Fără ele, nu ai putea să adaugi produse în coș, să te autentifici în cont sau să finalizezi o comandă. Aceste cookies nu colectează informații care pot fi folosite pentru marketing.</p>

                        <h2 style={h2Style}>3. Cookies de Performanță și Analiză</h2>
                        <p style={pStyle}>Utilizăm aceste cookies pentru a înțelege cum vizitatorii interacționează cu site-ul nostru (ex: paginile cele mai vizitate, erori întâmpinate). Toate informațiile colectate sunt anonime și sunt folosite doar pentru a îmbunătăți funcționarea site-ului.</p>

                        <h2 style={h2Style}>4. Cum poți controla Cookies?</h2>
                        <p style={pStyle}>Majoritatea browserelor permit gestionarea cookies-urilor din setări. Poți alege să blochezi sau să ștergi cookies, însă acest lucru poate afecta funcționalitatea anumitor părți ale site-ului MODERNSHOP.</p>

                        <h2 style={h2Style}>5. Actualizări</h2>
                        <p style={pStyle}>Putem actualiza această Politică de Cookies periodic pentru a reflecta schimbările în tehnologie sau legislație. Orice modificare va fi afișată pe această pagină.</p>
                        
                        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center' }}>
                             <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                                <strong>Operator:</strong> CULOAREA DIN VIATA SA SRL | CUI: RO44820819 | J20/1108/2021
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

const h2Style: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--dark)' };
const pStyle: React.CSSProperties = { marginBottom: '1.5rem', opacity: 0.85 };
