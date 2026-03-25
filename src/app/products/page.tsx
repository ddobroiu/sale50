import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/products';
import Navbar from '@/components/Navbar';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowRight, Grid3X3, List, ShoppingCart } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

export default async function Products({ searchParams }: PageProps) {
  const { page: pageParam, category, search } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1'));

  const [result, categories] = await Promise.all([
    getProducts(currentPage, category, search),
    getCategories(),
  ]);

  const { products, total, totalPages } = result;

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    return `/products?${params.toString()}`;
  }

  const delta = 3;
  const rangeStart = Math.max(1, currentPage - delta);
  const rangeEnd = Math.min(totalPages, currentPage + delta);
  const pageNumbers: number[] = [];
  for (let i = rangeStart; i <= rangeEnd; i++) pageNumbers.push(i);

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      {/* REFINED HEADER */}
      <section style={{ padding: '6rem 0 4rem', background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                        <Grid3X3 size={14} /> Catalog sale50.ro
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                        {category ? category : 'Toate Produsele'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                        Descoperă <strong style={{ color: 'var(--dark)' }}>{total.toLocaleString()}</strong> de rezultate premium selectate special.
                    </p>
                </div>
                {category && (
                    <Link href="/products" className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                        Resetează Filtrele ×
                    </Link>
                )}
            </div>
        </div>
      </section>

      {/* MAIN CATALOG LAYOUT */}
      <div className="container" style={{ padding: '4rem 0 8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem', alignItems: 'start' }} className='catalog-grid'>

          {/* SIDEBAR FILTERS */}
          <aside style={{ position: 'sticky', top: '120px' }} className='desktop-only'>
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                {/* Search in Side */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={sidebarTitleStyle}>Căutare Rapidă</h3>
                    <form action="/products" method="GET">
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                name="search"
                                defaultValue={search || ''}
                                placeholder="Cuvânt cheie..."
                                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', background: '#f8fafc', outline: 'none' }}
                                className='sidebar-input'
                            />
                            {category && <input type="hidden" name="category" value={category} />}
                        </div>
                    </form>
                </div>

                {/* Categories List */}
                <h3 style={sidebarTitleStyle}>Categorii</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Link href="/products" style={{ 
                        padding: '0.75rem 1rem', 
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem', 
                        fontWeight: !category ? 800 : 500, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        background: !category ? 'var(--primary-soft)' : 'transparent',
                        color: !category ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                    }} className='side-cat-link'>
                        <span>Toate Produsele</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{categories.reduce((a,c) => a + c.count, 0)}</span>
                    </Link>
                    {categories.map(cat => (
                        <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`} style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.9rem',
                            fontWeight: category === cat.name ? 800 : 500,
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: category === cat.name ? 'var(--primary-soft)' : 'transparent',
                            color: category === cat.name ? 'var(--primary)' : 'var(--text-muted)',
                            transition: 'all 0.2s'
                        }} className='side-cat-link'>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{cat.name}</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{cat.count}</span>
                        </Link>
                    ))}
                </div>
                
                <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--dark)', borderRadius: 'var(--radius-xl)', color: 'white' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingCart size={14} color="var(--primary)" /> Smart Ship
                    </h4>
                    <p style={{ fontSize: '0.75rem', opacity: 0.6, lineHeight: 1.5 }}>Livrare rapidă în 24-48h din stoc local pentru orice comandă.</p>
                </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '10rem 0', background: 'white', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-color)' }}>
                <Search size={48} color="var(--text-light)" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '1rem' }}>Niciun produs găsit</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Încearcă să schimbi termenii de căutare sau categoria.</p>
                <Link href="/products" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Resetează Filtrele</Link>
              </div>
            ) : (
              <>
                <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                  {products.map((product) => (
                    <Link href={`/product/${product.sku}`} key={product.sku} className="card">
                      <div className="card-img-wrap" style={{ padding: '2rem' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} loading="lazy" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'var(--bg-soft)', borderRadius: '50%' }} />
                        )}
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }} className='badge badge-new'>NEW</div>
                      </div>
                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                          {product.category}
                        </p>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--dark)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5, height: '2.9rem' }}>
                          {product.name}
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--dark)' }}>{product.priceWithVat.toFixed(2)} <small style={{fontSize: '0.75rem'}}>Lei</small></span>
                            <div style={{ color: 'var(--primary)', background: 'var(--primary-soft)', padding: '0.5rem', borderRadius: '10px' }}>
                                <ShoppingCart size={18} />
                            </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* MODERN PAGINATION */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '3rem 0', borderTop: '1px solid var(--border-color)', marginTop: '2rem' }}>
                    {currentPage > 1 && (
                        <Link href={pageUrl(currentPage - 1)} style={paginBtnStyle}>
                        <ChevronLeft size={18} />
                        </Link>
                    )}
                    {pageNumbers.map(p => (
                        <Link 
                            key={p} 
                            href={pageUrl(p)} 
                            style={{ 
                                ...paginBtnStyle, 
                                background: p === currentPage ? 'var(--dark)' : 'white', 
                                color: p === currentPage ? 'white' : 'var(--dark)',
                                border: p === currentPage ? '1px solid var(--dark)' : '1px solid var(--border-color)',
                                boxShadow: p === currentPage ? 'var(--shadow-md)' : 'none'
                            }}
                        >
                        {p}
                        </Link>
                    ))}
                    {currentPage < totalPages && (
                        <Link href={pageUrl(currentPage + 1)} style={paginBtnStyle}>
                        <ChevronRight size={18} />
                        </Link>
                    )}
                    </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-input:focus { border-color: var(--primary) !important; background: white !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05); }
        .side-cat-link:hover:not([style*="background: var(--primary-soft)"]) { background: var(--bg-white) !important; color: var(--primary) !important; padding-left: 1.25rem !important; border: 1px solid var(--border-soft); }
        @media (max-width: 992px) {
            .catalog-grid { grid-template-columns: 1fr !important; }
            .desktop-only { display: none; }
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

const paginBtnStyle: React.CSSProperties = {
  width: '44px', height: '44px', borderRadius: 'var(--radius-lg)',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem',
  transition: 'all 0.2s'
};
