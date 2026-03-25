"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <main style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container" style={{ paddingTop: '8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }} className="contact-grid">
                    
                    {/* INFO SIDE */}
                    <div style={{ position: 'sticky', top: '8rem' }} className="contact-info">
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                            Hai să <br /><span style={{color: 'var(--primary)'}}>discutăm.</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
                            Ai întrebări despre un produs, vrei o ofertă pentru firma ta sau ai nevoie de ajutor cu o comandă? Echipa sale50.ro este gata să te ajute.
                        </p>

                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div style={contactBoxStyle}>
                                <div style={iconStyle}><Mail size={24} /></div>
                                <div>
                                    <p style={labelStyle}>EMAIL</p>
                                    <a href="mailto:contact@sale50.ro" style={valueStyle}>contact@sale50.ro</a>
                                </div>
                            </div>

                            <div style={contactBoxStyle}>
                                <div style={iconStyle}><Phone size={24} /></div>
                                <div>
                                    <p style={labelStyle}>TELEFON & WHATSAPP</p>
                                    <a href="tel:0750473111" style={valueStyle}>07xx xxx xxx</a>
                                </div>
                            </div>

                            <div style={contactBoxStyle}>
                                <div style={iconStyle}><MapPin size={24} /></div>
                                <div>
                                    <p style={labelStyle}>DEPODZIT CENTRAL</p>
                                    <p style={valueStyle}>Sat Topliceni, Buzău, România</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FORM SIDE */}
                    <div style={{ background: 'white', padding: '4rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }}>
                        {sent ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--primary-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
                                    <Send size={40} />
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Mesaj Trimis!</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Îți vom răspunde în cel mai scurt timp posibil. De obicei durază sub 2 ore.</p>
                                <button onClick={() => setSent(false)} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Trimite alt mesaj</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-row">
                                    <div style={inputGroupStyle}>
                                        <label style={inputLabelStyle}>Nume Complet</label>
                                        <input type="text" placeholder="Ex: Ion Popescu" required style={inputStyle} />
                                    </div>
                                    <div style={inputGroupStyle}>
                                        <label style={inputLabelStyle}>Telefon</label>
                                        <input type="tel" placeholder="Ex: 07xx xxx xxx" style={inputStyle} />
                                    </div>
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={inputLabelStyle}>Adresa de Email</label>
                                    <input type="email" placeholder="Ex: nume@companie.ro" required style={inputStyle} />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={inputLabelStyle}>Mesajul Tău</label>
                                    <textarea rows={6} placeholder="Cu ce te putem ajuta?" required style={{ ...inputStyle, height: 'auto', paddingTop: '1rem' }}></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                    Trimite Mesajul <MessageSquare size={20} />
                                </button>
                                
                                <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.6 }}>
                                    Prin trimitere, ești de acord cu prelucrarea datelor tale personale.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 1000px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                    .contact-info { position: static !important; margin-bottom: 4rem; }
                    .form-row { grid-template-columns: 1fr !important; }
                }
            `}} />
        </main>
    );
}

const contactBoxStyle: React.CSSProperties = { display: 'flex', gap: '1.5rem', alignItems: 'center' };
const iconStyle: React.CSSProperties = { width: '60px', height: '60px', background: 'white', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)', border: '1px solid var(--border-color)' };
const labelStyle: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.25rem' };
const valueStyle: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark)', textDecoration: 'none' };

const inputGroupStyle: React.CSSProperties = { display: 'grid', gap: '0.5rem' };
const inputLabelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark)' };
const inputStyle: React.CSSProperties = { width: '100%', height: '3.5rem', padding: '0 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: '#f9fafb', fontSize: '1rem', outline: 'none' };
