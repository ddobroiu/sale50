import React from 'react';
import { Award, Target, Zap, ShieldCheck, Factory, Users } from 'lucide-react';

export const metadata = {
    title: "Despre Noi | sale50.ro",
    description: "Cunoaște echipa sale50.ro și misiunea noastră de a oferi accesorii de top la jumătate de preț.",
};

export default function AboutPage() {
    return (
        <main style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container" style={{ paddingTop: '8rem' }}>
                
                {/* HERO */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }} className="about-hero">
                    <div>
                        <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'inline-block' }}>STRATEGIE PREMIUM</span>
                        <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>Calitate de lux. <br/><span style={{color: 'var(--primary)'}}>Preț corect.</span></h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                            La sale50.ro, misiunea noastră este simplă: să îți oferim acces la accesorii și echipamente de top fără adaosurile comerciale exagerate. Suntem importatori direcți, ceea ce ne permite să oferim reducerile pe care le vezi astăzi.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                                <Award color="var(--primary)" /> 10+ Ani Exp.
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                                <Users color="var(--primary)" /> 50.000+ Clienți
                            </div>
                        </div>
                    </div>
                    <div style={{ background: 'var(--dark)', borderRadius: 'var(--radius-2xl)', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), transparent)' }}></div>
                         <Factory size={120} style={{ opacity: 0.1, color: 'white' }} />
                    </div>
                </div>

                {/* VALUES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '6rem' }} className="values-grid">
                    <div style={valueCardStyle}>
                        <div style={iconCircleStyle}><Target size={24} /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Misiunea Noastră</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Să oferim accesibilitate și transparență totală. Fiecare preț este calculat corect, fără costuri ascunse.</p>
                    </div>
                    <div style={valueCardStyle}>
                        <div style={iconCircleStyle}><Zap size={24} color="#eab308" /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Sourcing Global</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Lucrăm cu fabrici de renume pentru a aduce produse care respectă cele mai înalte standarde UE.</p>
                    </div>
                    <div style={valueCardStyle}>
                        <div style={iconCircleStyle}><ShieldCheck size={24} color="#16a34a" /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Calitate Garantată</h3>
                        <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>Fiecare produs este verificat individual înainte de a fi expediat către tine.</p>
                    </div>
                </div>

                {/* COMPANY INFO */}
                <div style={{ background: 'white', padding: '4rem', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Informații Legale</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Operăm cu responsabilitate și respectăm legislația comerțului online din România.</p>
                    <div style={{ display: 'inline-grid', gap: '1rem', textAlign: 'left', background: 'var(--bg-soft)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
                        <p><strong>Companie:</strong> CULOAREA DIN VIATA SA SRL</p>
                        <p><strong>CUI:</strong> RO44820819</p>
                        <p><strong>Reg. Com:</strong> J20/1108/2021</p>
                        <p><strong>Sediu:</strong> Sat Topliceni, Com. Topliceni, Jud. Buzău</p>
                    </div>
                </div>

            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 900px) {
                    .about-hero { grid-template-columns: 1fr !important; }
                    .values-grid { grid-template-columns: 1fr !important; }
                }
            `}} />
        </main>
    );
}

const valueCardStyle: React.CSSProperties = {
    background: 'white',
    padding: '3rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.3s ease'
};

const iconCircleStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    background: 'var(--primary-soft)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    color: 'var(--primary)'
};
