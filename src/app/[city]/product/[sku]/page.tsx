import React from 'react';
import Link from 'next/link';
import { getProductBySku, getProducts } from '@/lib/products';
import { ArrowLeft, Truck, ShieldCheck, MapPin, HelpCircle, ArrowRight } from 'lucide-react';
import { TOP_CITIES, slugify } from '@/lib/locations';
import AddToCartButton from '@/components/AddToCartButton';
import WishlistToggleButton from '@/components/WishlistToggleButton';
import ProductCard from '@/components/ProductCard';

import DeliveryInfo from '@/components/DeliveryInfo';

export async function generateMetadata({ params }: { params: Promise<{ city: string, sku: string }> }) {
  const { city, sku } = await params;
  const product = await getProductBySku(sku);
  if (!product) return { title: 'Produs' };

  const decodedCity = decodeURIComponent(city);
  const match = TOP_CITIES.find(c => c.toLowerCase().replace(' ', '-') === decodedCity.toLowerCase());
  const cityName = match || (decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1).replace(/-/g, ' '));

  return {
    title: `Cumpără ${product.name} în ${cityName} | sale50.ro`,
    description: `Căutai ${product.name} în ${cityName}? Cumpără acum cu livrare rapidă din stoc, garanție 2 ani și preț imbatabil. Reduceri reale la accesorii premium în ${cityName}.`,
    keywords: `${product.name} ${cityName}, magazin ${product.category} ${cityName}, pret ${product.name}, livrare rapida ${cityName}, buy ${product.name}`,
    openGraph: {
      title: `${product.name} - Livrare Rapidă în ${cityName} | sale50.ro`,
      description: `Comandă ${product.name} direct din depozit. Ajunge la tine în ${cityName} în 24-48 de ore!`,
      images: [product.image]
    }
  };
}

export default async function ProductCityDetail({ params }: { params: Promise<{ city: string, sku: string }> }) {
    const { city, sku } = await params;
    const decodedCity = decodeURIComponent(city);
    const match = TOP_CITIES.find(c => c.toLowerCase().replace(' ', '-') === decodedCity.toLowerCase());
    const cityName = match || (decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1).replace(/-/g, ' '));
    
    const product = await getProductBySku(sku);
    
    if (!product) return (
      <main style={{ minHeight: '100vh', padding: '10rem 0', textAlign: 'center' }}>
        <h1>Produs negăsit</h1>
        <Link href={`/${city}/products`}>Înapoi la catalog {cityName}</Link>
      </main>
    );
  
    const relatedResult = await getProducts(1, product.category);
    const related = (relatedResult.products || []).filter(p => p.sku !== sku).slice(0, 4);

    return (
        <main style={{ minHeight: '100vh', background: '#fcfcfc', color: 'var(--text-main)' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: product.name,
                    image: [product.image, ...product.additionalImages],
                    description: `Descoperă ${product.name} disponibil acum pentru livrare rapidă în ${cityName}.`,
                    sku: product.sku,
                    mpn: product.sku,
                    brand: { '@type': 'Brand', name: 'sale50.ro' },
                    offers: {
                        '@type': 'Offer',
                        url: `https://www.sale50.ro/${city}/product/${sku}`,
                        priceCurrency: 'RON',
                        price: product.priceWithVat.toFixed(2),
                        availability: 'https://schema.org/InStock',
                        seller: { '@type': 'Organization', name: 'sale50.ro' }
                    }
                }) }}
            />

            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '10rem' }}>
                
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '3rem', color: 'var(--text-light)', fontWeight: 500 }}>
                    <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
                    <span>/</span>
                    <Link href={`/${city}/products`} style={{ color: 'var(--text-muted)' }}>{cityName}</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{product.name}</span>
                </nav>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', alignItems: 'start' }}>
                    <div style={{ position: 'sticky', top: '120px' }}>
                        <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: '1px solid var(--border-color)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', boxShadow: 'var(--shadow-sm)' }}>
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{product.category}</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>SKU: {product.sku}</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', color: 'var(--dark)' }}>{product.name}</h1>
                        
                        <DeliveryInfo county={cityName} className="mb-10" />

                        <div style={{ marginBottom: '3rem' }}>
                            <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--dark)' }}>{product.priceWithVat.toFixed(2)}</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark)', marginLeft: '1rem' }}>LEI</span>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '4rem' }}>
                            <AddToCartButton product={product} />
                            <WishlistToggleButton product={product} showText={true} />
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--dark)' }}>Specificații & Descriere</h3>
                            <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '3rem' }}>
                                {Object.entries(product.attributes).map(([k,v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{k}</span>
                                        <span style={{ color: 'var(--dark)', fontSize: '0.9rem', fontWeight: 600 }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>
                    </div>
                </div>

                <section style={{ marginTop: '10rem' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '4rem' }}>Alte recomandări în <span style={{ color: 'var(--primary)' }}>{cityName}</span></h2>
                    <div className="grid-cols-4">
                        {related.map((p: any) => (
                            <ProductCard key={p.sku} product={p} citySlug={city} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

const benefitBoxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.25rem',
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    flex: 1
};
