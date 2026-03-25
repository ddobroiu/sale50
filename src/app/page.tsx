import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/products';
import Navbar from '@/components/Navbar';
import { ArrowRight, ShoppingCart, Truck, ShieldCheck, CreditCard, Clock, Sparkles } from 'lucide-react';
import { TOP_CITIES } from '@/lib/locations';

export default async function Home() {
  const { products: featuredProducts } = await getProducts(1);
  const featured = featuredProducts.slice(0, 8);
  const categories = await getCategories();
  const popularCategories = categories.slice(0, 6);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '8rem', background: '#fcfcfc' }}>
      <Navbar />

      <div className="container">
        {/* HERO SECTION - REFINED FOR SALE50.RO */}
        <section style={{ 
            marginTop: '2rem',
            background: 'var(--dark)',
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            minHeight: '520px',
            position: 'relative',
            color: 'white'
        }}>
            {/* Background Decorative Gradient */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
                zIndex: 1
            }}></div>

            <div style={{ flex: 1, padding: '5rem', zIndex: 10, position: 'relative' }}>
                <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '0.5rem 1rem', 
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '2rem',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Sparkles size={14} color="var(--primary)" /> Smart Shopping. Premium Quality.
                </div>
                
                <h1 style={{ 
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                    fontWeight: 800, 
                    lineHeight: 1,
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.04em',
                    color: 'white'
                }}>
                    Reducerile pe care <br/>le așteptai sunt aici.
                </h1>
                
                <p style={{ 
                    fontSize: '1.2rem', 
                    color: 'rgba(255,255,255,0.6)', 
                    marginBottom: '3rem',
                    maxWidth: '550px',
                    lineHeight: 1.6
                }}>
                    La <strong>sale50.ro</strong>, combinăm calitatea premium cu prețurile imbatabile. 
                    Descoperă mii de produse cu livrare rapidă direct din stoc local.
                </p>
                
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <Link href="/products" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem' }}>
                        Vezi Oferta <ArrowRight size={20} />
                    </Link>
                    <Link href="/categories" className="btn btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.2)', padding: '1.2rem 2.5rem', fontSize: '1rem' }}>
                        Categorii
                    </Link>
                </div>
            </div>

            {/* Decorative Image/Graphic Placeholder */}
            <div style={{ 
                flex: 1, 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                zIndex: 5
            }} className="desktop-only">
                <div style={{ 
                    width: '380px', 
                    height: '380px', 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20% 80% 30% 70% / 60% 30% 70% 40%',
                    position: 'relative',
                    animation: 'morph 15s ease-in-out infinite'
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <span style={{ fontSize: '6rem', fontWeight: 900, opacity: 0.1, display: 'block' }}>50%</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 300, opacity: 0.5 }}>DISCOUNT</span>
                    </div>
                </div>
            </div>
        </section>

        {/* TRUST SIGNALS - MORE PREMIUM */}
        <section style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }} className='signals-grid'>
            <div className="feature-box" style={{ padding: '2rem', border: '1px solid var(--border-soft)' }}>
                <div className="feature-icon" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}><Truck size={24} /></div>
                <div><h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>Livrare 24h</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Din stoc propriu local</p></div>
            </div>
            <div className="feature-box" style={{ padding: '2rem', border: '1px solid var(--border-soft)' }}>
                <div className="feature-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><ShieldCheck size={24} /></div>
                <div><h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>Garanție 2 Ani</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Siguranță totală</p></div>
            </div>
            <div className="feature-box" style={{ padding: '2rem', border: '1px solid var(--border-soft)' }}>
                <div className="feature-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><CreditCard size={24} /></div>
                <div><h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>Plată Securizată</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Card sau Ramburs</p></div>
            </div>
            <div className="feature-box" style={{ padding: '2rem', border: '1px solid var(--border-soft)' }}>
                <div className="feature-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><Clock size={24} /></div>
                <div><h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>Retur Garantat</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>14 zile fără întrebări</p></div>
            </div>
        </section>

        {/* CATEGORIES - REFINED */}
        <section style={{ marginTop: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Categorii <span style={{ color: 'var(--primary)' }}>Populare</span></h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Descoperă selecția noastră curatoriată de top.</p>
                </div>
                <Link href="/categories" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', padding: '0.5rem 0' }}>
                    Vezi tot catalogul <ArrowRight size={18} />
                </Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.5rem' }} className='cats-grid'>
                {popularCategories.map((cat) => (
                    <Link href={`/products?category=${encodeURIComponent(cat.name)}`} key={cat.name} style={{ textAlign: 'center', display: 'block' }}>
                        <div className="card" style={{ 
                            padding: '2rem',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.25rem',
                        }}>
                            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} className='cat-zoom' />
                        </div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)' }}>{cat.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{cat.count} produse</p>
                    </Link>
                ))}
            </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section style={{ marginTop: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Recomandări <span style={{ color: 'var(--primary)' }}>Sale50</span></h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Produse premium la prețuri de importator direct, verificate manual pentru calitate.</p>
            </div>
            
            <div className="grid-cols-4">
                {featured.map((product) => (
                    <Link href={`/${TOP_CITIES[0].toLowerCase()}/product/${product.sku}`} key={product.sku} className="card">
                        <div className="card-img-wrap">
                            <div className="badge badge-hot" style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 10 }}>HOT</div>
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', fontWeight: 800 }}>{product.category}</p>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--dark)', marginBottom: '1.5rem', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {product.name}
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textDecoration: 'line-through', marginBottom: '-0.2rem' }}>{(product.priceWithVat * 1.3).toFixed(0)} Lei</div>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{product.priceWithVat.toFixed(2)} <small style={{ fontSize: '0.8rem' }}>Lei</small></span>
                                </div>
                                <button className="btn btn-primary" style={{ padding: '0.6rem', borderRadius: '12px' }}>
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                <Link href="/products" className="btn btn-secondary" style={{ padding: '1rem 3rem' }}>
                    Vezi toate produsele <ArrowRight size={18} />
                </Link>
            </div>
        </section>

        {/* SEO CITY LIST - REFINED */}
        <section style={{ marginTop: '10rem', padding: '6rem 4rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '300px', height: '300px', background: 'var(--primary-soft)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.5, zIndex: 0 }}></div>
             
             <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>Rețea Națională</div>
                    <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Livrăm rapid oriunde în țară</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Alege orașul tău pentru a beneficia de experiența de livrare locală optimizată de sale50.ro.</p>
                </div>
                <div className="seo-link-grid" style={{ justifyContent: 'center', gap: '1rem' }}>
                    {TOP_CITIES.slice(0, 40).map(c => (
                        <Link key={c} href={`/${c.toLowerCase().replace(/\s+/g, '-')}/products`} className="seo-link" style={{ padding: '0.75rem 1.5rem' }}>
                            {c}
                        </Link>
                    ))}
                </div>
             </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes morph {
            0% { border-radius: 20% 80% 30% 70% / 60% 30% 70% 40%; }
            50% { border-radius: 70% 30% 70% 40% / 20% 80% 30% 70%; }
            100% { border-radius: 20% 80% 30% 70% / 60% 30% 70% 40%; }
        }
        .cat-zoom:hover { transform: scale(1.1); }
        
        @media (max-width: 992px) {
            .signals-grid { grid-template-columns: 1fr 1fr !important; }
            .cats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
            .signals-grid { grid-template-columns: 1fr !important; }
            .cats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            section { padding-left: 1rem; padding-right: 1rem; }
        }
      `}} />
    </main>
  );
}
