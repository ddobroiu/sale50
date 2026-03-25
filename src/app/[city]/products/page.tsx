import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/products';
import { Search, SlidersHorizontal, MapPin, Zap, ArrowRight, ShoppingCart, Info, CheckCircle2 } from 'lucide-react';
import { TOP_CITIES, slugify } from '@/lib/locations';

import ProductCard from '@/components/ProductCard';

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  const match = TOP_CITIES.find(c => c.toLowerCase().replace(' ', '-') === decodedCity.toLowerCase());
  const cityName = match || (decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1).replace(/-/g, ' '));
  
  return {
    title: `Accesorii și Echipamente Premium în ${cityName} | Livrare în 24h`,
    description: `Magazin online de accesorii și echipamente în ${cityName}. Livrăm peste 10.000 de produse din stoc direct la ușa ta! Cele mai bune prețuri și oferte locale.`,
    keywords: `accesorii ${cityName}, magazin echipamente ${cityName}, produse electronice ${cityName}, livrare rapida ${cityName}`
  };
}

export default async function CityProductsListing({ params, searchParams }: { 
    params: Promise<{ city: string }>,
    searchParams: Promise<{ page?: string, search?: string, category?: string }>
}) {
    const { city } = await params;
    const { search, page, category } = await searchParams;
    const decodedCity = decodeURIComponent(city);
    const match = TOP_CITIES.find(c => c.toLowerCase().replace(' ', '-') === decodedCity.toLowerCase());
    const cityName = match || (decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1).replace(/-/g, ' '));

    const currentPage = parseInt(page || '1');
    const { products, total, totalPages } = await getProducts(currentPage, category, search);
    const categories = await getCategories();

    return (
        <main style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '8rem' }}>
            <div className="container" style={{ paddingTop: '4rem' }}>
                {/* Header SEO with Modern Aesthetic */}
                <header style={{ 
                    marginBottom: '5rem', 
                    textAlign: 'center',
                    background: 'white',
                    padding: '4rem 2rem',
                    borderRadius: 'var(--radius-2xl)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '30%', height: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%)', zIndex: 0 }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.6rem', 
                            color: 'var(--primary)', 
                            fontWeight: 800, 
                            fontSize: '0.8rem', 
                            marginBottom: '1.5rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.15em',
                            background: 'var(--primary-soft)',
                            padding: '0.5rem 1.25rem',
                            borderRadius: 'var(--radius-full)'
                        }}>
                            <MapPin size={16} /> Livrare Rapidă în {cityName}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--dark)', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                            Magazin Accesorii <span style={{ color: 'var(--primary)' }}>{cityName}</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.8, fontWeight: 400 }}>
                            Explorați colecția noastră de peste 10.000 de produse premium. 
                            Garantăm livrarea locală în <strong>24-48h</strong> direct în {cityName} și localitățile învecinate cu opțiune de verificare colet.
                        </p>
                    </div>
                </header>

                <div className="listing-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3.5rem' }}>
                    {/* Persistent Sidebar Filters */}
                    <aside style={{ height: 'fit-content', position: 'sticky', top: '120px' }} className="desktop-only">
                        <div style={{ 
                            background: 'white', 
                            padding: '2.5rem', 
                            borderRadius: 'var(--radius-xl)', 
                            border: '1px solid var(--border-color)', 
                            boxShadow: 'var(--shadow-md)' 
                        }}>
                            <div style={{ marginBottom: '3rem' }}>
                                <h3 style={sidebarTitleStyle}>
                                    <Search size={18} color="var(--primary)" /> Căutare
                                </h3>
                                <form action={`/${city}/products`} method="GET">
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="text" 
                                            name="search" 
                                            defaultValue={search}
                                            placeholder="Brand sau model..." 
                                            style={{ 
                                                width: '100%', 
                                                padding: '1rem', 
                                                borderRadius: 'var(--radius-lg)', 
                                                border: '1px solid var(--border-color)', 
                                                background: '#f8fafc', 
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                transition: 'all 0.2s'
                                            }}
                                            className="sidebar-search"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div style={{ marginBottom: '3rem' }}>
                                <h3 style={sidebarTitleStyle}>
                                    <SlidersHorizontal size={18} color="var(--primary)" /> Categorii
                                </h3>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {categories.slice(0, 15).map(cat => (
                                        <Link 
                                            key={cat.name} 
                                            href={`/${city}/products?category=${encodeURIComponent(cat.name)}`} 
                                            style={{ 
                                                fontSize: '0.85rem', 
                                                color: category === cat.name ? 'var(--primary)' : 'var(--text-muted)',
                                                fontWeight: category === cat.name ? 700 : 500,
                                                padding: '0.6rem 0.75rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                borderRadius: 'var(--radius-md)',
                                                background: category === cat.name ? 'var(--primary-soft)' : 'transparent',
                                                transition: 'all 0.2s',
                                                textDecoration: 'none'
                                            }}
                                            className="cat-link-hover"
                                        >
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>{cat.name}</span>
                                            <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{cat.count}</span>
                                        </Link>
                                    ))}
                                    <Link href="/categories" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                                        Vezi toate categoriile <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>

                            {/* Trust Badge Sidebar */}
                            <div style={{ 
                                padding: '1.5rem', 
                                background: 'var(--dark)', 
                                color: 'white', 
                                borderRadius: 'var(--radius-xl)', 
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <Zap size={32} style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.1 }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle2 size={16} color="var(--primary)" /> Stoc Local
                                </h4>
                                <p style={{ fontSize: '0.75rem', opacity: 0.6, lineHeight: 1.5 }}>Livrare accelerată în <strong>{cityName}</strong>. Comandă azi, primește mâine.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid Control */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            background: 'white', 
                            padding: '1.25rem 2.5rem', 
                            borderRadius: 'var(--radius-xl)', 
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={16} color="var(--primary)" />
                                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{total.toLocaleString()} rezultate găsite</p>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                Pagina <strong style={{ color: 'var(--dark)' }}>{currentPage}</strong> din {totalPages}
                            </div>
                        </div>

                        {/* Professional Grid */}
                        <div className="grid-cols-4">
                            {products.map(product => (
                                <ProductCard key={product.sku} product={product} citySlug={city} />
                            ))}
                        </div>

                        {/* Modern Pagination Navigation */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '4rem' }}>
                                {[...Array(Math.min(10, totalPages))].map((_, i) => {
                                    const pageNum = i + 1;
                                    const isActive = currentPage === pageNum;
                                    return (
                                        <Link 
                                            key={pageNum} 
                                            href={`/${city}/products?page=${pageNum}${search ? '&search='+search : ''}${category ? '&category='+encodeURIComponent(category) : ''}`}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: isActive ? 'var(--dark)' : 'white',
                                                color: isActive ? 'white' : 'var(--dark)',
                                                borderRadius: 'var(--radius-lg)',
                                                border: '1px solid var(--border-color)',
                                                fontWeight: 800,
                                                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                                                transition: 'all 0.3s ease',
                                                textDecoration: 'none'
                                            }}
                                            className="pagination-link"
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SEO Section: Strategic Context */}
            <section style={{ padding: '8rem 0', marginTop: '8rem', borderTop: '1px solid var(--border-color)', background: 'white' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            Experiență de Shopping Locală <br/><span style={{ color: 'var(--primary)' }}>Adaptată Orașului {cityName}</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                            Suntem dedicați clienților noștri din <strong>{cityName}</strong>. Înțelegem importanța promptitudinii, de aceea am optimizat logistica noastră locală pentru a asigura cea mai scurtă durată de livrare. Fie că ai nevoie de un încărcător rapid, o husă de protecție sau accesorii pentru casă, suntem aici să le livrăm direct la ușa ta.
                        </p>
                    </div>

                    <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Explorează alte zone din județ
                    </h3>
                    <div className="seo-link-grid">
                        {TOP_CITIES.slice(0, 48).map(c => {
                            const linkCity = slugify(c);
                            return (
                                <Link key={c} href={`/${linkCity}/products`} className="seo-link">
                                    Accesorii {c}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{ __html: `
                .sidebar-search:focus {
                    background: white !important;
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05);
                }
                .cat-link-hover:hover {
                    background: var(--bg-soft) !important;
                    color: var(--primary) !important;
                    padding-left: 1rem !important;
                }
                .pagination-link:hover:not(:active) {
                    transform: translateY(-3px);
                    border-color: var(--primary);
                    color: var(--primary);
                }
                @media (max-width: 900px) {
                    .listing-layout { grid-template-columns: 1fr !important; }
                    .listing-layout aside { display: none; }
                }
            `}} />
        </main>
    );
}

const sidebarTitleStyle: React.CSSProperties = { 
    fontSize: '0.75rem', 
    fontWeight: 800, 
    textTransform: 'uppercase', 
    letterSpacing: '0.15em', 
    color: 'var(--text-light)', 
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
};
