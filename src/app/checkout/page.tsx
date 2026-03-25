"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import {
  ShieldCheck,
  Truck,
  X,
  CreditCard,
  Banknote,
  MapPin,
  AlertCircle,
  Package,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import CheckoutForm from "./CheckoutForm";
import DeliveryInfo from "@/components/DeliveryInfo";
import { getEstimatedShippingCost } from "@/lib/shippingUtils";

type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
  postCode?: string;
  country?: string;
};

type BillingInfo = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  name?: string;
  email?: string;
  telefon?: string;
  denumire_companie?: string;
  cui?: string;
  reg_com?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
  postCode?: string;
  country?: string;
};

type PaymentMethod = "card" | "cash_on_delivery";

function useSafeLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return defaultValue;
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}

export default function CheckoutPage() {
  const { cart, total, removeItem, clearCart } = useCart();

  const [address, setAddress] = useSafeLocalStorage<Address>("checkout_address_v2", {
    nume_prenume: "",
    email: "",
    telefon: "",
    judet: "",
    localitate: "",
    strada_nr: "",
    postCode: "",
    country: "RO",
  });

  const [billing, setBilling] = useSafeLocalStorage<BillingInfo>(
    "checkout_billing_v2",
    {
      tip_factura: "persoana_fizica",
      name: "",
      email: "",
      telefon: "",
      denumire_companie: "",
      cui: "",
      reg_com: "",
      judet: "",
      localitate: "",
      strada_nr: "",
      postCode: "",
      country: "RO",
    }
  );

  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [placing, setPlacing] = useState(false);

  const subtotal = total || 0;
  const MAX_RAMBURS_LIMIT = 500;
  const isRambursDisabled = subtotal > MAX_RAMBURS_LIMIT;

  useEffect(() => {
    if (isRambursDisabled && paymentMethod === 'cash_on_delivery') {
      setPaymentMethod('card');
    }
  }, [isRambursDisabled, paymentMethod]);
  const shippingCost = useMemo(() => {
    if (subtotal >= 500) return 0;
    return getEstimatedShippingCost(address.country || 'RO', cart);
  }, [subtotal, cart, address.country]);

  const totalWithShipping = subtotal + shippingCost;
  const freeShippingRemaining = Math.max(0, 500 - subtotal);
  const hasFreeShipping = freeShippingRemaining === 0;

  const fmt = (val: number) => 
    new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      maximumFractionDigits: 2,
    }).format(val);

    async function onPlaceOrder() {
        if (!cart.length) {
            alert("Coșul este gol!");
            return;
        }

        if (!address.nume_prenume || !address.email || !address.telefon || !address.judet || !address.localitate || !address.strada_nr) {
            alert("Te rugăm să completezi toate datele de livrare obligatorii.");
            return;
        }

        if (billing.tip_factura === 'persoana_juridica' && (!billing.denumire_companie || !billing.cui)) {
            alert("Te rugăm să completezi datele firmei.");
            return;
        }

        if (!acceptTerms) {
            alert("Trebuie să accepți termenii și condițiile.");
            return;
        }

        setPlacing(true);
        
        try {
            const payload = {
                name: address.nume_prenume,
                email: address.email,
                phone: address.telefon,
                shipping: {
                    judet: address.judet,
                    localitate: address.localitate,
                    address: address.strada_nr,
                    postCode: address.postCode,
                    country: address.country || 'RO'
                },
                billing: {
                    type: billing.tip_factura === 'persoana_juridica' ? 'pj' : 'pf',
                    companyName: billing.denumire_companie || '',
                    cui: billing.cui || '',
                    regCom: billing.reg_com || '',
                    judet: billing.judet || address.judet,
                    localitate: billing.localitate || address.localitate,
                    address: billing.strada_nr || address.strada_nr,
                    country: billing.country || address.country || 'RO'
                },
                paymentMethod,
                items: cart.map(it => ({
                    sku: it.sku,
                    name: it.name,
                    price: it.price,
                    quantity: it.quantity
                })),
                total: totalWithShipping,
                shippingFee: shippingCost
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.ok) {
                clearCart();
                window.location.href = `/checkout/success?orderId=${data.orderId}`;
            } else {
                alert("Eroare: " + (data.message || "Nu s-a putut plasa comanda."));
            }
        } catch (err) {
            console.error("Order error:", err);
            alert("A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
        } finally {
            setPlacing(false);
        }
    }

  if (cart.length === 0 && !placing) {
      return (
          <main style={{ minHeight: '100vh', paddingTop: '10rem', textAlign: 'center' }}>
              <div className="container">
                  <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '4rem', borderRadius: '2rem', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--text-muted)' }}>
                        <Package size={40} />
                      </div>
                      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Coșul tău este gol</h1>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Adaugă produse în coș pentru a putea finaliza comanda.</p>
                      <Link href="/products" className="btn-premium" style={{ display: 'inline-block' }}>Înapoi la cumpărături</Link>
                  </div>
              </div>
          </main>
      );
  }

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '10rem' }}>
      <div className="container" style={{ paddingTop: '6rem' }}>
        
        {/* Breadcrumbs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: 600 }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>Acasă</Link>
          <ChevronRight size={14} />
          <Link href="/cart" style={{ color: 'var(--text-muted)' }}>Coș</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--dark)', fontWeight: 800 }}>Finalizare Comandă</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }} className="checkout-main-grid">
          
          {/* LEFT SIDE: FORMS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)', letterSpacing: '-0.03em' }}>Checkout</h1>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800 }}>{cart.length} Produse</div>
            </div>

            <CheckoutForm
              address={address}
              setAddress={(updater: any) => setAddress(updater)}
              billing={billing}
              setBilling={(updater: any) => setBilling(updater)}
              sameAsDelivery={sameAsDelivery}
              setSameAsDelivery={setSameAsDelivery}
              errors={{}}
            />
          </div>

          {/* RIGHT SIDE: SUMMARY & PAYMENT */}
          <aside>
            <div style={{ position: 'sticky', top: '120px', display: 'grid', gap: '2rem' }}>
              
              {/* Order Items Summary */}
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Package size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Rezumat produse</h3>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                        <div key={item.sku} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '50px', height: '50px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9', padding: '0.25rem', flexShrink: 0 }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.quantity} x {fmt(item.price)}</div>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--dark)' }}>{fmt(item.price * item.quantity)}</div>
                        </div>
                    ))}
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CreditCard size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Metodă de plată</h3>
                </div>
                <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                    <label style={{ 
                        ...paymentOptionStyle(paymentMethod === 'cash_on_delivery'),
                        opacity: isRambursDisabled ? 0.5 : 1,
                        cursor: isRambursDisabled ? 'not-allowed' : 'pointer'
                    }}>
                        <input 
                            type="radio" 
                            name="payment" 
                            disabled={isRambursDisabled}
                            checked={paymentMethod === 'cash_on_delivery'} 
                            onChange={() => !isRambursDisabled && setPaymentMethod('cash_on_delivery')} 
                            style={{ display: 'none' }} 
                        />
                        <div style={radioCircleStyle(paymentMethod === 'cash_on_delivery')}>
                            <Truck size={18} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Ramburs la curier</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                {isRambursDisabled ? "Indisponibil peste 500 lei" : "Plătești cash sau card la livrare"}
                            </div>
                        </div>
                    </label>

                    <label style={paymentOptionStyle(paymentMethod === 'card')}>
                        <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ display: 'none' }} />
                        <div style={radioCircleStyle(paymentMethod === 'card')}>
                            <CreditCard size={18} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Card Online</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Securizat prin Stripe / Netopia</div>
                        </div>
                    </label>

                    <label style={paymentOptionStyle(paymentMethod === 'bank_transfer' as any)}>
                        <input type="radio" name="payment" checked={paymentMethod === ('bank_transfer' as any)} onChange={() => setPaymentMethod('bank_transfer' as any)} style={{ display: 'none' }} />
                        <div style={radioCircleStyle(paymentMethod === ('bank_transfer' as any))}>
                            <Banknote size={18} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Transfer Bancar (OP)</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Ideal pentru persoane juridice</div>
                        </div>
                    </label>
                </div>
              </div>

              {/* Delivery ETA */}
              <DeliveryInfo county={address.judet} className="shadow-sm" />

              {/* Final Totals */}
              <div style={{ background: 'var(--dark)', color: 'white', borderRadius: 'var(--radius-2xl)', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, fontSize: '0.9rem' }}>
                        <span>Subtotal</span>
                        <span>{fmt(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, fontSize: '0.9rem' }}>
                        <span>Livrare</span>
                        <span>{hasFreeShipping ? 'GRATUIT' : fmt(shippingCost)}</span>
                    </div>
                    {!hasFreeShipping && (
                        <div style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={14} />
                            Mai adaugă {fmt(freeShippingRemaining)} pentru transport gratuit!
                        </div>
                    )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total de plată</span>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2.25rem', fontWeight: 900 }}>{fmt(totalWithShipping)}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>TVA INCLUS</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '0.2rem', accentColor: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.75rem', opacity: 0.7, lineHeight: 1.5 }}>Sunt de acord cu <Link href="/termeni" style={{ color: 'white', textDecoration: 'underline' }}>Termenii și Condițiile</Link> sale50.ro</span>
                    </label>

                    <button 
                        onClick={onPlaceOrder}
                        disabled={placing || !acceptTerms}
                        className="btn-premium" 
                        style={{ 
                            width: '100%', 
                            padding: '1.25rem', 
                            fontSize: '1rem', 
                            background: placing || !acceptTerms ? '#334155' : 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            cursor: (placing || !acceptTerms) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {placing ? 'Se procesează...' : (
                            <>
                                <ShieldCheck size={20} />
                                FINALIZEAZĂ COMANDA
                            </>
                        )}
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.7rem', opacity: 0.5 }}>
                        <ShieldCheck size={12} />
                        Plată Securizată SSL 256-bit
                    </div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 1100px) {
              .checkout-main-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
              aside { position: static !important; }
          }
      `}} />
    </main>
  );
}

const paymentOptionStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: '16px',
    border: `2px solid ${active ? 'var(--primary)' : 'var(--border-color)'}`,
    background: active ? 'var(--primary-soft)' : 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
});

const radioCircleStyle = (active: boolean): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: active ? 'var(--primary)' : '#f1f5f9',
    color: active ? 'white' : 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
});
