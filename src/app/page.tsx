import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/products';
import { ArrowRight, ShoppingCart, Truck, ShieldCheck, CreditCard, Clock, Sparkles } from 'lucide-react';
import { TOP_CITIES, slugify, getRandomCity } from '@/lib/locations';

import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const { products: featuredProducts } = await getProducts(1);
  const featured = featuredProducts.slice(0, 8);
  const categories = await getCategories();
  const popularCategories = categories.slice(0, 6);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '8rem', background: '#fcfcfc' }}>
      <div className="container">
        {/* HERO SECTION - REFINED FOR SALE50.RO */}
        <section style={{ 
            marginTop: '2rem',
            background: 'var(--dark)',
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            <div style={{ padding: '6rem 4rem', position: 'relative', zIndex: 2, maxWidth: '800px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', color: 'white', fontSize: '0.75rem', fontWeight: 700, marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
                    <Sparkles size={14} color="var(--primary)" /> OFERTE LIMITATE - DISCOUNT DE PÂNĂ LA 50%
                </div>
                <h1 style={{ fontSize: '4.5rem', color: 'white', fontWeight: 800, lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
                    Magazinul tău pentru <span style={{ color: 'var(--primary)' }}>Echipamente</span> Premium.
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '500px' }}>
                    Calitate garantată, livrare ultra-rapidă și prețuri imbatabile pentru cele mai căutate produse ale momentului.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/products" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
                        Vezi Produsele <ArrowRight size={20} />
                    </Link>
                    <Link href="/categories" className="btn btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                        Categorii
                    </Link>
                </div>
            </div>
            
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, var(--dark), transparent)', zIndex: 1 }} className="desktop-only" />
        </section>

        {/* TRUST SIGNALS */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
            {[
                { icon: Truck, title: 'Livrare 24-48h', desc: 'Din stoc local propriu' },
                { icon: ShieldCheck, title: 'Garanție inclusă', desc: 'Produse verificate tehnic' },
                { icon: CreditCard, title: 'Plată Securizată', desc: 'Card, Rate sau Ramburs' },
                { icon: Clock, title: 'Suport 24/7', desc: 'Suntem aici pentru tine' }
            ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <item.icon size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>{item.desc}</p>
                    </div>
                </div>
            ))}
        </section>

        {/* POPULAR CATEGORIES */}
        <section style={{ marginTop: '8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Categorii <span className="gradient-text">Populare</span></h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Alege dintr-o gamă variată de produse premium.</p>
                </div>
                <Link href="/categories" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Toate Categoriile <ArrowRight size={16} />
                </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                {popularCategories.map((cat: any) => (
                    <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`} className="card-cat-modern" style={{ textAlign: 'center', textDecoration: 'none' }}>
                        <div style={{ width: '100%', aspectRatio: '1', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', marginBottom: '1rem', transition: 'all 0.3s ease' }} className="img-wrap">
                            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--dark)', fontSize: '0.9rem' }}>{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section style={{ marginTop: '8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Recomandările <span className="gradient-text">sale50</span></h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Cele mai apreciate și căutate produse din stoc.</p>
                </div>
                <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Vezi tot catalogul <ArrowRight size={16} />
                </Link>
            </div>
            <div className="grid-cols-4">
                {featured.map((product: any) => {
                    const randomCity = getRandomCity(product.sku);
                    const citySlug = slugify(randomCity);
                    return (
                        <ProductCard key={product.sku} product={product} citySlug={citySlug} />
                    )
                })}
            </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ marginTop: '8rem', background: 'var(--primary)', borderRadius: 'var(--radius-2xl)', padding: '6rem 4rem', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>Pregătit pentru cumpărături?</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 3rem' }}>Alătură-te celor peste 50.000 de clienți mulțumiți care aleg calitatea sale50.ro în fiecare lună.</p>
                <Link href="/products" className="btn btn-secondary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }}>
                    Începe Acum <ArrowRight size={20} />
                </Link>
            </div>
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', transform: 'rotate(-20deg)' }} />
        </section>

        {/* CITIES INDEX (SEO) */}
        <section style={{ marginTop: '8rem', paddingBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Livrare rapidă în peste 300 de localități:</h3>
            <div className="seo-link-grid">
                {TOP_CITIES.slice(0, 30).map((cityName: string) => (
                    <Link key={cityName} href={`/${slugify(cityName)}/products`} className="seo-link">
                        Produse {cityName}
                    </Link>
                ))}
                <Link href="/products" className="seo-link" style={{ background: 'var(--bg-soft)', fontWeight: 800 }}>
                    ... și multe altele
                </Link>
            </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-text {
            background: linear-gradient(90deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .card-cat-modern:hover .img-wrap {
            border-color: var(--primary) !important;
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        @media (max-width: 768px) {
            h1 { fontSize: 2.5rem !important; }
            section { padding: 3rem 1.5rem !important; }
            .grid-cols-4 { grid-template-columns: 1fr !important; }
        }
      `}} />
    </main>
  );
}
