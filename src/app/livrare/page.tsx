import React from 'react';
import Navbar from '@/components/Navbar';
import { Truck, Clock, MapPin, Package, ShieldCheck } from 'lucide-react';

export const metadata = {
    title: "Livrare și Retur | MODERNSHOP",
    description: "Informații despre modalitățile de livrare, costuri de transport și politica de retur.",
};

export default function LivrarePage() {
    return (
        <main style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '8rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Livrare și <span className="gradient-text">Retur</span></h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Transparență totală pentru comenzile tale.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
                        
                        {/* LIVRARE */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}><Truck size={28} color="var(--primary)" /></div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Modalități de Livrare</h2>
                            <p style={pStyle}>Livrăm rapid în toată România prin intermediul partenerului nostru <strong>DPD Courier</strong>.</p>
                            <ul style={listStyle}>
                                <li><strong>Cost Livrare Standard:</strong> 19.99 Lei</li>
                                <li><strong>Produse Agabaritice:</strong> 39.00 Lei</li>
                                <li><strong>Livrare Gratuită:</strong> Pentru comenzi peste 500 Lei</li>
                            </ul>
                        </div>

                        {/* TIMP */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}><Clock size={28} color="var(--primary)" /></div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Timp de Livrare</h2>
                            <p style={pStyle}>Suntem ultra-rapizi. Procesăm și trimitem produsele tale în cel mai scurt timp.</p>
                            <div style={{ background: 'var(--bg-soft)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
                                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>24 - 48 Ore Lucrătoare</p>
                                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>Valabil pentru orice localitate din România.</p>
                            </div>
                        </div>

                        {/* RETUR */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}><ShieldCheck size={28} color="#16a34a" /></div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Politica de Retur</h2>
                            <p style={pStyle}>Nu ești mulțumit? Nicio problemă. Ai dreptul de a returna produsele în termen de <strong>14 zile calendaristice</strong>.</p>
                            <ul style={listStyle}>
                                <li>Produsele trebuie să fie în starea originală.</li>
                                <li>Returul se procesează în maxim 7 zile lucrătoare.</li>
                                <li>Excepție fac produsele personalizate (dacă este cazul).</li>
                            </ul>
                        </div>

                        {/* DEPZIT */}
                        <div style={cardStyle}>
                            <div style={iconBoxStyle}><MapPin size={28} color="#dc2626" /></div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ridicare Personală</h2>
                            <p style={pStyle}>Poți ridica oricând comanda gratuit direct din depozitul nostru central.</p>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Locație: Com. Topliceni, nr. 214, Jud. Buzău</p>
                            <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>Program: L-V 09:00 - 18:00</p>
                        </div>

                    </div>

                    <div style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-2xl)', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <Package size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Ai întrebări despre statusul comenzii?</h3>
                        <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Intră în contul tău pentru a vedea numărul AWB și locația coletului în timp real.</p>
                        <a href="/account" className="btn-premium" style={{ display: 'inline-flex' }}>Vezi Comanda Mea</a>
                    </div>
                </div>
            </div>
        </main>
    );
}

const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '3rem',
    borderRadius: 'var(--radius-2xl)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)'
};

const iconBoxStyle: React.CSSProperties = {
    width: '56px',
    height: '56px',
    background: 'var(--bg-soft)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem'
};

const pStyle: React.CSSProperties = { marginBottom: '1rem', opacity: 0.8, lineHeight: 1.6 };

const listStyle: React.CSSProperties = {
    display: 'grid',
    gap: '0.75rem',
    marginTop: '1.5rem',
    fontSize: '0.95rem',
    opacity: 0.8,
    listStyleType: 'disc',
    paddingLeft: '1.2rem'
};
