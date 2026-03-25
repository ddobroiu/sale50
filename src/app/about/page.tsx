import React from 'react';
import Navbar from '@/components/Navbar';
import { Award, Target, Zap, ShieldCheck, Factory, Users } from 'lucide-react';

export const metadata = {
    title: "Despre Noi | MODERNSHOP",
    description: "Cunoaște echipa MODERNSHOP și misiunea noastră de a oferi accesorii de top.",
};

export default function AboutPage() {
    return (
        <main style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '8rem' }}>
                
                {/* HERO */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
                    <div>
                        <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'inline-block' }}>SHOPPRINT ECOSYSTEM</span>
                        <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>Mai mult decât un <span className="gradient-text">magazin.</span></h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                            Suntem partenerul tău de încredere în furnizarea de soluții premium. Cu o experiență de peste 10 ani în producție și comerț, redefinim standardele de calitate pentru fiecare produs livrat.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                                <Award color="var(--primary)" /> 10+ Ani Exp.
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                                <Users color="var(--primary)" /> Echipă Dedicată
                            </div>
                        </div>
                    </div>
                    <div style={{ background: 'var(--dark)', borderRadius: 'var(--radius-3xl)', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), transparent)' }}></div>
                         <Factory size={120} style={{ opacity: 0.1, color: 'white' }} />
                    </div>
                </div>

                {/* VALUES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '6rem' }}>
                    <div style={valueCardStyle}>
                        <div style={iconCircleStyle}><Target size={24} /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Misiunea Noastră</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Să oferim accesibilitate și transparență totală. Fiecare preț este calculat corect, fără costuri ascunse.</p>
                    </div>
                    <div style={valueCardStyle}>
                        <div style={iconCircleStyle}><Zap size={24} color="#eab308" /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Tehnologie Top</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Utilizăm infrastructură modernă pentru procesarea rapidă a comenzilor și suport automatizat de ultimă generație.</p>
                    </div>
                    <div style={valueCardStyle}>
                        <div style={iconCircleStyle}><ShieldCheck size={24} color="#16a34a" /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Calitate Garantată</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Fiecare produs este verificat individual înainte de a fi expediat către tine.</p>
                    </div>
                </div>

                {/* COMPANY INFO */}
                <div style={{ background: 'white', padding: '4rem', borderRadius: 'var(--radius-3xl)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Informații Legale</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Operăm sub entitatea juridică mamă a ecosistemului ShopPrint.</p>
                    <div style={{ display: 'inline-grid', gap: '1rem', textAlign: 'left', background: 'var(--bg-soft)', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                        <p><strong>Companie:</strong> CULOAREA DIN VIATA SA SRL</p>
                        <p><strong>CUI:</strong> RO44820819</p>
                        <p><strong>Reg. Com:</strong> J20/1108/2021</p>
                        <p><strong>Sediu:</strong> Sat Topliceni, Com. Topliceni, Jud. Buzău</p>
                    </div>
                </div>

            </div>
        </main>
    );
}

const valueCardStyle: React.CSSProperties = {
    background: 'white',
    padding: '3rem',
    borderRadius: 'var(--radius-2xl)',
    border: '1px solid var(--border)',
    transition: 'all 0.3s ease'
};

const iconCircleStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    background: 'var(--bg-soft)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    color: 'var(--primary)'
};
