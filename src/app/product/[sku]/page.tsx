import React from 'react';
import Link from 'next/link';
import { getProductBySku, getProducts } from '@/lib/products';
import { ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import WishlistToggleButton from '@/components/WishlistToggleButton';
import ProductCard from '@/components/ProductCard';

import DeliveryInfo from '@/components/DeliveryInfo';

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);
  if (!product) return { title: 'Produs' };
  return {
    title: `${product.name} | sale50.ro`,
    description: `Cumpără ${product.name} online. Livrare rapidă în toată România. TVA inclus.`,
    alternates: { canonical: `/product/${sku}` }
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);
  
  if (!product) {
    return (
      <main style={{ minHeight: '100vh', background: 'white', paddingTop: 'var(--nav-height)' }}>
        <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Produs negăsit</h1>
          <Link href="/products" className="btn-premium">Vezi toate produsele</Link>
        </div>
      </main>
    );
  }

  const relatedResult = await getProducts(1, product.category);
  const related = (relatedResult.products || []).filter(p => p.sku !== sku).slice(0, 4);

  return (
    <main style={{ minHeight: '100vh', background: 'white', paddingTop: 'var(--nav-height)' }}>
      {/* JSON-LD SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description.replace(/<[^>]*>?/gm, '').substring(0, 160),
        "sku": product.sku,
        "brand": { "@type": "Brand", "name": "sale50.ro" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "RON",
          "price": product.priceWithVat.toFixed(2),
          "availability": "https://schema.org/InStock"
        }
      }) }} />

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '10rem' }}>
        
        {/* Back */}
        <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: '#999', marginBottom: '4rem' }}>
          <ArrowLeft size={16} /> Toate Produsele
        </Link>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '6rem', alignItems: 'start' }}>
          
          {/* GALLERY */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{ background: '#fcfcfc', borderRadius: 'var(--radius-xl)', border: '1px solid #f1f1f1', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {product.additionalImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
                {product.additionalImages.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', background: '#fcfcfc', border: '1px solid #f1f1f1', padding: '0.5rem', overflow: 'hidden' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.category}</span>
              <span style={{ color: '#ccc' }}>·</span>
              <span style={{ color: '#999', fontWeight: 700 }}>COD: {product.sku}</span>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2.5rem', letterSpacing: '-0.03em' }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: 900 }}>{product.priceWithVat.toFixed(2)}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#999' }}>LEI</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>Preț incluzând TVA 21%. Factură fiscală automată.</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <AddToCartButton product={product} />
              <WishlistToggleButton product={product} showText={true} />
            </div>

            <div style={{ marginTop: '3rem', display: 'grid', gap: '1.5rem' }}>
              <DeliveryInfo />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', background: '#fcfcfc', borderRadius: 'var(--radius-xl)', border: '1px solid #f1f1f1' }}>
                <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <ShieldCheck size={20} color="#2563eb" />
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>Garanție 24 Luni</p>
                  <p style={{ fontSize: '0.75rem', color: '#999' }}>Retur gratuit 14 zile conform legii</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ borderTop: '1px solid #f1f1f1', marginTop: '3.5rem', paddingTop: '3.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Descriere</h3>
              <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#666' }} dangerouslySetInnerHTML={{ __html: product.description }} />
              
              {Object.keys(product.attributes).length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Specificații Tehnice</h3>
                  {Object.entries(product.attributes).map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.95rem' }}>
                      <span style={{ fontWeight: 600 }}>{k}</span>
                      <span style={{ color: '#666' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section style={{ marginTop: '10rem', borderTop: '1px solid #eee', paddingTop: '6rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4rem', letterSpacing: '-0.03em' }}>Produse similare</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem' }}>
              {related.map((p: any) => (
                <ProductCard key={p.sku} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .prod-lux { transition: all 0.3s ease; }
        .prod-lux:hover { transform: translateY(-8px); }
        .prod-lux:hover img { transform: scale(1.05); transition: transform 0.4s ease; }
      `}} />
    </main>
  );
}
