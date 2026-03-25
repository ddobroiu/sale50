"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck
} from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ 
            background: '#0f172a', 
            color: 'white', 
            padding: '5rem 0 3rem',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div className="container">
                {/* Main Footer Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '4rem', 
                    marginBottom: '5rem' 
                }}>
                    
                    {/* Brand & Mission */}
                    <div>
                        <Link href="/" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '1.5rem',
                        }}>
                             <img 
                                src="/logo.png" 
                                alt="sale50.ro logo" 
                                style={{ 
                                    height: '38px', 
                                    width: 'auto',
                                    objectFit: 'contain',
                                    filter: 'brightness(0) invert(1)' // Make it white for dark footer
                                }} 
                            />
                        </Link>
                        <p style={{ opacity: 0.5, fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                            Platformă premium de e-commerce cu livrare ultrarapidă din stoc local. Produse verificate și garanție inclusă.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <a href="#" className="social-icon-min"><Facebook size={18} /></a>
                            <a href="#" className="social-icon-min"><Instagram size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h4 style={headerStyle}>Navigare</h4>
                        <div style={linkStackStyle}>
                            <Link href="/products" className="f-link">Toate Produsele</Link>
                            <Link href="/categories" className="f-link">Categorii</Link>
                            <Link href="/contact" className="f-link">Suport Clienți</Link>
                            <Link href="/about" className="f-link">Despre Noi</Link>
                        </div>
                    </div>

                    {/* Legal & Help */}
                    <div>
                        <h4 style={headerStyle}>Informații</h4>
                        <div style={linkStackStyle}>
                            <Link href="/termeni" className="f-link">Termeni și Condiții</Link>
                            <Link href="/confidentialitate" className="f-link">Confidențialitate</Link>
                            <Link href="/livrare" className="f-link">Livrare și Retur</Link>
                            <a href="https://anpc.ro" target="_blank" className="f-link">ANPC</a>
                            <a href="https://ec.europa.eu/consumers/odr" target="_blank" className="f-link">SOL</a>
                        </div>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 style={headerStyle}>Contact</h4>
                        <div style={linkStackStyle}>
                            <div style={contactBlock}>
                                <Phone size={14} style={{ color: 'var(--primary)' }} />
                                <span style={{ opacity: 0.6 }}>0750 473 111</span>
                            </div>
                            <div style={contactBlock}>
                                <Mail size={14} style={{ color: 'var(--primary)' }} />
                                <span style={{ opacity: 0.6 }}>contact@sale50.ro</span>
                            </div>
                            <div style={contactBlock}>
                                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                                <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Buzău, România</span>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '2.5rem' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Newsletter</p>
                            <form style={{ display: 'flex', gap: '0.5rem' }}>
                                <input 
                                    type="email" 
                                    placeholder="Email..." 
                                    style={miniInputStyle}
                                />
                                <button type="submit" style={miniBtnStyle}>OK</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Trust & Legal */}
                <div style={{ 
                    paddingTop: '3rem', 
                    borderTop: '1px solid rgba(255,255,255,0.05)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', opacity: 0.3, fontWeight: 500 }}>
                            &copy; {new Date().getFullYear()} CULOAREA DIN VIATA SA SRL. CUI: RO44820819
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', opacity: 0.2, filter: 'grayscale(100%)' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '12px' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '16px' }} />
                        <ShieldCheck size={16} />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .f-link {
                    color: rgba(255,255,255,0.45);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .f-link:hover {
                    color: white;
                    padding-left: 4px;
                }
                .social-icon-min {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.03);
                    color: rgba(255,255,255,0.4);
                    transition: all 0.2s;
                }
                .social-icon-min:hover {
                    background: var(--primary);
                    color: white;
                }
                @media (max-width: 768px) {
                    footer { padding: 4rem 0 3rem; }
                }
            `}} />
        </footer>
    );
}

const headerStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'white',
    marginBottom: '1.75rem'
};

const linkStackStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
};

const contactBlock: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem'
};

const miniInputStyle: React.CSSProperties = {
    flex: 1,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.6rem 0.75rem',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none'
};

const miniBtnStyle: React.CSSProperties = {
    padding: '0.6rem 1rem',
    background: 'var(--primary)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 800,
    cursor: 'pointer'
};
