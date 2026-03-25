import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/products';
import { 
  Smartphone, 
  Gamepad2, 
  Home, 
  Car, 
  Sparkles, 
  Sun, 
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';

interface Category {
  name: string;
  count: number;
  image: string;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  // Logic to group categories for a "professional" organized look
  const groupData = [
    { label: "Accesorii & Tehnologie", icon: Smartphone, keywords: ['telefoane', 'componente', 'adeziv', 'birou', 'it', 'laptop'] },
    { label: "Casă, Grădină & Smart", icon: Home, keywords: ['bucatarie', 'casa', 'maturi', 'perii', 'organizatoare', 'depozitare', 'gradina'] },
    { label: "Jucării, Copii & Bebe", icon: Gamepad2, keywords: ['jucarii', 'copii', 'kendama', 'maternitate', 'bebe', 'seturi'] },
    { label: "Auto & Accesorii Vehicule", icon: Car, keywords: ['auto', 'anvelope', 'masina', 'portbagaj'] },
    { label: "Lifestyle, Beauty & Sănătate", icon: Sparkles, keywords: ['machiaj', 'argint', 'sanatate', 'pandantiv', 'bijuterii', 'ingrijire'] },
    { label: "Energie & Panouri Solare", icon: Sun, keywords: ['solar', 'baterii', 'energie'] },
  ];

  const grouped: Record<string, { label: string, icon: any, items: Category[] }> = {};
  groupData.forEach(g => {
    grouped[g.label] = { label: g.label, icon: g.icon, items: [] };
  });
  grouped["Alte Categorii"] = { label: "Alte Categorii", icon: ShoppingBag, items: [] };

  categories.forEach(cat => {
    const name = cat.name.toLowerCase();
    let found = false;
    for (const g of groupData) {
      if (g.keywords.some(k => name.includes(k))) {
        grouped[g.label].items.push(cat);
        found = true;
        break;
      }
    }
    if (!found) grouped["Alte Categorii"].items.push(cat);
  });

  return (
    <main style={{ paddingBottom: '10rem', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <section style={{ padding: '6rem 0 4rem', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>
                <LayoutGrid size={16} /> INDEX CATEGORII sale50.ro
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.04em', color: 'var(--dark)' }}>Cumpără după <span style={{ color: 'var(--primary)' }}>Interes</span></h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '600px' }}>
                Catalogul nostru este organizat meticulos pentru a-ți oferi cea mai bună experiență de navigare. 
                Găsește rapid ceea ce cauți printre miile de produse din stoc.
              </p>
          </div>
        </div>
      </section>

      {/* Grouped Categories Section */}
      <div className="container" style={{ marginTop: '5rem' }}>
        <div style={{ display: 'grid', gap: '6rem' }}>
          {Object.values(grouped).filter(g => g.items.length > 0).map((group) => (
            <section key={group.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                    <group.icon size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>{group.label}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>{group.items.length} Categorii secundare</p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem'
              }} className='cats-grid-modern'>
                {group.items.map((cat) => (
                  <Link 
                    key={cat.name} 
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="card-cat-modern"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: 'white',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: 'none',
                      textDecoration: 'none'
                    }}
                  >
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        background: '#f8fafc',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.6rem',
                        flexShrink: 0,
                        border: '1px solid #f1f5f9'
                    }} className='img-wrap'>
                        <img 
                            src={cat.image} 
                            alt={cat.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{cat.count} produse</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .card-cat-modern:hover {
            border-color: var(--primary) !important;
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg) !important;
        }
        .card-cat-modern:hover .img-wrap {
            background: var(--primary-soft) !important;
        }
        @media (max-width: 1200px) {
            .cats-grid-modern { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 992px) {
            .cats-grid-modern { grid-template-columns: repeat(2, 1fr) !important; }
            h1 { font-size: 2.5rem !important; }
            section { padding: 4rem 0 2rem !important; }
        }
        @media (max-width: 576px) {
            .cats-grid-modern { grid-template-columns: 1fr !important; }
        }
      `}} />
    </main>
  );
}
