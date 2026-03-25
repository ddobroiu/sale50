"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Menu, 
  Smartphone, 
  Gamepad2, 
  Home, 
  Car, 
  Sparkles, 
  Sun, 
  ShoppingBag,
  LucideIcon,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

interface Category {
  name: string;
  count: number;
  image: string;
}

interface Group {
  label: string;
  icon: LucideIcon;
  subcategories: Category[];
  keywords: string[];
}

const CategoryDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupConfigs: Group[] = [
    { label: "Accesorii & IT", icon: Smartphone, keywords: ['telefoane', 'componente', 'adeziv', 'birou', 'it', 'laptop'], subcategories: [] },
    { label: "Casă & Grădină", icon: Home, keywords: ['bucatarie', 'casa', 'maturi', 'perii', 'organizatoare', 'depozitare', 'gradina'], subcategories: [] },
    { label: "Jucării & Copii", icon: Gamepad2, keywords: ['jucarii', 'copii', 'kendama', 'maternitate', 'bebe', 'seturi'], subcategories: [] },
    { label: "Auto & Transport", icon: Car, keywords: ['auto', 'anvelope', 'masina', 'portbagaj'], subcategories: [] },
    { label: "Lifestyle & Beauty", icon: Sparkles, keywords: ['machiaj', 'argint', 'sanatate', 'pandantiv', 'bijuterii', 'ingrijire'], subcategories: [] },
    { label: "Energie Solară", icon: Sun, keywords: ['solar', 'baterii', 'energie'], subcategories: [] },
    { label: "Alte Produse", icon: ShoppingBag, keywords: [], subcategories: [] },
  ];

  const grouped = groupConfigs.map(group => {
    const subcats = categories.filter(cat => {
        const name = cat.name.toLowerCase();
        if (group.keywords.length === 0) {
            // Check if it fits nowhere else
            return !groupConfigs.some(other => other !== group && other.keywords.some(k => name.includes(k)));
        }
        return group.keywords.some(k => name.includes(k));
    });
    return { ...group, subcategories: subcats };
  }).filter(g => g.subcategories.length > 0);

  // Set first group as active when opening
  useEffect(() => {
    if (isOpen && grouped.length > 0 && !activeGroup) {
      setActiveGroup(grouped[0].label);
    }
  }, [isOpen, grouped, activeGroup]);

  return (
    <div className="mega-nav-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: isOpen ? 'var(--dark)' : 'var(--bg-soft)', 
            padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-xl)',
            fontWeight: 800, fontSize: '0.85rem', color: isOpen ? 'white' : 'var(--dark)',
            border: 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.02em'
        }}
        className="nav-trigger-btn"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
        Categorii
      </button>

      {isOpen && (
        <div className="mega-menu" style={{
          position: 'absolute',
          top: 'calc(100% + 15px)',
          left: 0,
          background: 'white',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2), 0 0 10px rgba(0,0,0,0.02)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-color)',
          width: '900px',
          zIndex: 2000,
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          overflow: 'hidden',
          animation: 'megaIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          minHeight: '480px'
        }}>
          {/* LEFT: GROUP SELECTOR */}
          <div style={{ background: '#f8fafc', borderRight: '1px solid var(--border-color)', padding: '1.25rem' }}>
             <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '1.5rem', marginLeft: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Meniu Principal</p>
             <div style={{ display: 'grid', gap: '0.25rem' }}>
                {grouped.map((group) => (
                    <div 
                        key={group.label}
                        onMouseEnter={() => setActiveGroup(group.label)}
                        className={`group-item ${activeGroup === group.label ? 'active' : ''}`}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            padding: '1rem', borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            color: activeGroup === group.label ? 'var(--primary)' : 'var(--dark)',
                            background: activeGroup === group.label ? 'white' : 'transparent',
                            boxShadow: activeGroup === group.label ? 'var(--shadow-sm)' : 'none',
                            border: activeGroup === group.label ? '1px solid var(--border-color)' : '1px solid transparent'
                        }}
                    >
                        <group.icon size={20} className={activeGroup === group.label ? 'icon-active' : ''} />
                        <span style={{ flex: 1 }}>{group.label}</span>
                        <ChevronRight size={14} opacity={activeGroup === group.label ? 1 : 0.2} />
                    </div>
                ))}
             </div>
             
             <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <Link href="/products" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', padding: '1rem' }}>
                    <TrendingUp size={16} /> Cele mai noi oferte
                </Link>
             </div>
          </div>

          {/* RIGHT: CONTENT PANEL */}
          <div style={{ padding: '2.5rem', background: 'white' }}>
             {activeGroup && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>{activeGroup}</h2>
                        <Link href="/categories" onClick={() => setIsOpen(false)} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            Vezi tot catalogul <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '1.5rem' 
                    }}>
                        {grouped.find(g => g.label === activeGroup)?.subcategories.slice(0, 10).map(sub => (
                            <Link 
                                key={sub.name} 
                                href={`/products?category=${encodeURIComponent(sub.name)}`}
                                onClick={() => setIsOpen(false)}
                                className="mega-sub-link"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem', borderRadius: 'var(--radius-xl)',
                                    background: '#fcfcfc', border: '1px solid #f8fafc',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none'
                                }}
                            >
                                <div style={{ 
                                    width: '50px', height: '50px', 
                                    background: 'white', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0.5rem', border: '1px solid #f1f5f9', flexShrink: 0
                                }} className='sub-img-wrap'>
                                    <img src={sub.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dark)' }}>{sub.name}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{sub.count} produse</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600 }}>
                        Livrare în 24h disponibilă pentru toată selecția din {activeGroup}.
                    </div>
                </div>
             )}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes megaIn {
              from { opacity: 0; transform: translateY(15px) scale(0.98); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .group-item:hover { background: white !important; color: var(--primary) !important; padding-left: 1.25rem !important; }
            .mega-sub-link:hover {
                border-color: var(--primary) !important;
                background: white !important;
                transform: translateY(-3px);
                box-shadow: var(--shadow-md) !important;
            }
            .mega-sub-link:hover .sub-img-wrap { border-color: var(--primary) !important; background: var(--primary-soft) !important; }
          `}} />
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
