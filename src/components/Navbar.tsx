"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X, Phone, Heart } from 'lucide-react';
import { useCart } from './CartContext';
import CategoryDropdown from './CategoryDropdown';

const Navbar: React.FC = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
        position: 'sticky',
        top: 0,
        background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
        zIndex: 1000,
        borderBottom: '1px solid var(--border-color)',
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(0,0,0,0.1)' : '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease'
    }}>
      {/* Top Bar for trust/contact */}
      <div style={{ background: 'var(--dark)', color: 'white', fontSize: '0.75rem', padding: '0.5rem 0', display: 'flex' }} className='top-bar'>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', opacity: 0.8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={12} /> 0750 473 111</span>
            <span style={{ fontWeight: 600 }}>Livrăm rapid oriune în România în 24-48h!</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/contact" style={{ opacity: 0.8 }}>Suport</Link>
            <Link href="/livrare" style={{ opacity: 0.8 }}>Livrare & Retur</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        height: 'var(--nav-height)',
        gap: '2.5rem'
      }}>
        {/* MOBILE MENU ICON */}
        <button 
            className="mobile-only" 
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--dark)' }}
        >
            <Menu size={24} />
        </button>

        {/* LOGO */}
        <Link href="/" style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          color: 'var(--primary)',
          letterSpacing: '-0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          flexShrink: 0
        }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '1.1rem' }}>S</span>
          </div>
          sale50.ro
        </Link>
        
        {/* Categories Dropdown (Desktop Only) */}
        <div className="desktop-only text-09 font-600">
           <CategoryDropdown />
        </div>

        {/* SEARCH BAR (E-Commerce style) */}
        <form action="/products" method="GET" style={{ flex: 1, position: 'relative' }} className="desktop-only">
            <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                <Search size={20} />
            </div>
            <input 
                type="text" 
                name="search"
                placeholder="Caută produse, branduri sau categorii..." 
                style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 3rem',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-color)',
                    background: '#f8fafc',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
                className="search-input"
            />
        </form>

        {/* ACTIONS */}
        <div style={{
          display: 'flex',
          gap: '1.75rem',
          alignItems: 'center',
          flexShrink: 0
        }}>
          {/* Mobile Search Trigger would go here if needed */}

          <Link href="/account" className="nav-action-link h-scale desktop-only">
            <User size={24} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Contul Meu</span>
          </Link>

          <Link href="/wishlist" className="nav-action-link h-scale desktop-only">
            <Heart size={24} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Favorite</span>
          </Link>

          <Link href="/cart" className="nav-action-link h-scale" style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                <span style={{
                    position: 'absolute', top: '-6px', right: '-8px',
                    background: 'var(--primary)', color: 'white',
                    borderRadius: '50%', width: '18px', height: '18px',
                    fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, border: '2px solid white'
                }}>{itemCount}</span>
                )}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Coș: {itemCount > 0 ? itemCount : '0'}</span>
          </Link>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <>
            <div 
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(4px)' }} 
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <div style={{ 
                position: 'fixed', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: '300px', 
                background: 'white', zIndex: 2001, padding: '2rem', 
                display: 'flex', flexDirection: 'column', gap: '2rem',
                animation: 'slideIn 0.3s ease-out'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 800 }}>Meniu</h3>
                    <button onClick={() => setIsMobileMenuOpen(false)} style={{ border: 'none', background: 'none' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Acasă</Link>
                    <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Categorii</Link>
                    <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Toate Produsele</Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Contact</Link>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Profilul Meu</Link>
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} style={mobileLinkStyle}>Coș Cumpărături</Link>
                </div>
            </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .top-bar { transition: height 0.3s ease, padding 0.3s ease; }
        .is-scrolled .top-bar { height: 0; padding: 0; overflow: hidden; }
        
        .nav-action-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
            color: var(--text-main);
            transition: all 0.2s ease;
        }
        .nav-action-link:hover { color: var(--primary); }
        .h-scale:hover { transform: scale(1.05); }

        .search-input:focus {
            background: white !important;
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .mobile-only { display: none; }
        
        @media (max-width: 992px) {
            .desktop-only { display: none; }
            .mobile-only { display: block; }
            .container { gap: 1rem !important; }
        }

        @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
        }
      `}} />
    </header>
  );
};

const mobileLinkStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--dark)'
};

export default Navbar;
