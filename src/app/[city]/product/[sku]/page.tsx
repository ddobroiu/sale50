import React, { Suspense } from 'react';
import Link from 'next/link';
import { getProductBySku, getProducts } from '@/lib/products';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Truck, ShieldCheck, MapPin, Zap, CheckCircle2, ShoppingCart, HelpCircle, ArrowRight } from 'lucide-react';
import { TOP_CITIES } from '@/lib/locations';
import AddToCartButton from '@/components/AddToCartButton';

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
  
  if (!product) return <div>Produs negăsit</div>;

  const relatedResult = await getProducts(1, product.category);
  const related = (relatedResult.products || []).filter(p => p.sku !== sku).slice(0, 4);

  // Schema.org JSON-LD for Google Shopping / Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image, ...product.additionalImages],
    description: `Descoperă ${product.name} disponibil acum pentru livrare rapidă în ${cityName}. Beneficiază de calitatea sale50.ro.`,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'sale50.ro'
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.sale50.ro/${city}/product/${sku}`,
      priceCurrency: 'RON',
      price: product.priceWithVat.toFixed(2),
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'sale50.ro'
      }
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fcfcfc', color: 'var(--text-main)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '10rem' }}>
        
        {/* Modern Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '3rem', color: 'var(--text-light)', fontWeight: 500 }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>/</span>
            <Link href={`/${city}/products`} style={{ color: 'var(--text-muted)' }}>{cityName}</Link>
            <span>/</span>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-muted)' }}>{product.category}</Link>
            <span>/</span>
            <span style={{ color: 'var(--dark)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{product.name}</span>
        </nav>

        {/* MAIN PRODUCT LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', alignItems: 'start' }} className='product-main-grid'>
            
            {/* GALLERY SIDE */}
            <div style={{ position: 'sticky', top: '120px' }}>
                <div style={{ 
                    background: 'white', 
                    borderRadius: 'var(--radius-2xl)', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border-color)', 
                    aspectRatio: '1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '3rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                
                {product.additionalImages.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginTop: '1.25rem' }}>
                        {[product.image, ...product.additionalImages].slice(0, 4).map((img, i) => (
                            <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', background: 'white', border: '1px solid var(--border-color)', padding: '0.5rem', cursor: 'pointer', overflow: 'hidden' }} className='thumb-hover'>
                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CONTENT SIDE */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {product.category}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>SKU: {product.sku}</span>
                    </div>
                    {product.stock > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>
                            <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
                            În stoc
                        </div>
                    )}
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', color: 'var(--dark)', letterSpacing: '-0.03em' }}>
                    {product.name}
                </h1>

                {/* Local Info Highlight */}
                <div style={{ 
                    background: 'white', 
                    padding: '1.25rem', 
                    borderRadius: 'var(--radius-xl)', 
                    border: '1px solid var(--border-color)', 
                    marginBottom: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--primary-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Livrare rapidă în {cityName}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comandă în următoarele <strong style={{color: 'var(--dark)'}}>4 ore</strong> pentru expediere astăzi.</p>
                    </div>
                </div>

                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--dark)' }}>{product.priceWithVat.toFixed(2)}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark)' }}>LEI</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textDecoration: 'line-through' }}>{(product.priceWithVat * 1.3).toFixed(0)} Lei</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 500 }}>Preț final cu TVA inclus. Livrare calculată la checkout.</p>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>
                    <AddToCartButton product={product} />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                        <div style={benefitBoxStyle}>
                            <Truck size={20} color="var(--primary)" />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Retur 14 Zile</span>
                        </div>
                        <div style={benefitBoxStyle}>
                            <ShieldCheck size={20} color="var(--primary)" />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Garanție 24 Luni</span>
                        </div>
                    </div>
                </div>

                {/* FEATURES TAB */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dark)' }}>Detalii & Specificații</h3>
                    
                    <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '3rem' }}>
                        {Object.entries(product.attributes).map(([k,v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{k}</span>
                                <span style={{ color: 'var(--dark)', fontSize: '0.9rem', fontWeight: 600 }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="product-description" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)', background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--dark)' }}>
                            <HelpCircle size={18} color="var(--primary)" />
                            <h4 style={{ fontWeight: 800 }}>Informații Produs</h4>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                </div>
            </div>
        </div>

        {/* RELATED PRODUCTS */}
        <section style={{ marginTop: '10rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Alte recomandări <span style={{ color: 'var(--primary)' }}>Smart</span></h2>
                    <p style={{ color: 'var(--text-muted)' }}>Produse similare selectate pentru tine.</p>
                </div>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Vezi toată categoria <ArrowRight size={18} />
                </Link>
            </div>
            
            <div className="grid-cols-4">
                {related.map(p => (
                    <Link key={p.sku} href={`/${city}/product/${p.sku}`} className="card">
                        <div className="card-img-wrap" style={{ padding: '2rem' }}>
                            <img src={p.image} alt={p.name} />
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--dark)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.6rem' }}>{p.name}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--dark)' }}>{p.priceWithVat.toFixed(2)} <small style={{fontSize: '0.7rem'}}>Lei</small></span>
                                <div style={{ color: 'var(--primary)', background: 'var(--primary-soft)', padding: '0.4rem', borderRadius: '8px' }}>
                                    <ShoppingCart size={18} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .product-description p { margin-bottom: 1.25rem; }
        .thumb-hover:hover { border-color: var(--primary) !important; transform: scale(1.05); transition: all 0.3s ease; }
        @media (max-width: 992px) {
            .product-main-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
            .product-main-grid > div:first-child { position: static !important; }
        }
      `}} />
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
