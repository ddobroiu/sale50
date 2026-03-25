"use client";
import React, { useEffect } from "react";
import JudetSelector from "@/components/JudetSelector";
import LocalitateSelector from "@/components/LocalitateSelector";
import { DPD_COUNTRIES } from "@/lib/shippingUtils";
import { COUNTRY_REGIONS } from "@/lib/regionsData";

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

type Billing = {
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

export default function CheckoutForm({
    address,
    setAddress,
    billing,
    setBilling,
    sameAsDelivery,
    setSameAsDelivery,
    errors,
}: {
    address: Address;
    setAddress: (updater: (a: Address) => Address) => void;
    billing: Billing;
    setBilling: (updater: (b: Billing) => Billing) => void;
    sameAsDelivery: boolean;
    setSameAsDelivery: (v: boolean) => void;
    errors: Record<string, string>;
}) {
    const onAddr = (k: keyof Address, v: string) => setAddress((a) => ({ ...a, [k]: v }));
    const onBill = <K extends keyof Billing>(k: K, v: Billing[K]) => setBilling((b) => ({ ...b, [k]: v }));

    useEffect(() => {
        if (!sameAsDelivery) return;
        setBilling((b) => ({
            ...b,
            name: address.nume_prenume,
            judet: address.judet,
            localitate: address.localitate,
            strada_nr: address.strada_nr,
            postCode: address.postCode,
            country: address.country,
        }));
    }, [sameAsDelivery, address.nume_prenume, address.judet, address.localitate, address.strada_nr, address.postCode, address.country, setBilling]);

    const inputCls = (hasError?: string) => `checkout-input ${hasError ? "error" : ""}`;

    return (
        <div className="space-y-8">
            {/* 1. LIVRARE */}
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</span>
                    Date de livrare
                </h2>

                <div className="form-grid">
                    <div className="col-span-2">
                        <Field id="address.country" label="Țară">
                            <select className={inputCls()} value={address.country || 'RO'} onChange={(e) => { const c = e.target.value; setAddress(a => ({ ...a, country: c, judet: '', localitate: '' })); }}>
                                {DPD_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </Field>
                    </div>
                    <div className="col-span-2">
                        <Field id="address.nume_prenume" label="Nume și Prenume" error={errors["address.nume_prenume"]}>
                            <input className={inputCls(errors["address.nume_prenume"])} value={address.nume_prenume} onChange={(e) => onAddr("nume_prenume", e.target.value)} placeholder="ex: Popescu Ion" />
                        </Field>
                    </div>
                    <div className="col-span-2">
                        <Field id="address.telefon" label="Telefon" error={errors["address.telefon"]}>
                            <input className={inputCls(errors["address.telefon"])} value={address.telefon} onChange={(e) => onAddr("telefon", e.target.value)} placeholder="07xxxxxxxx" />
                        </Field>
                    </div>
                    <div className="col-span-2">
                        <Field id="address.email" label="Email" error={errors["address.email"]}>
                            <input className={inputCls(errors["address.email"])} value={address.email} onChange={(e) => onAddr("email", e.target.value)} placeholder="email@exemplu.ro" />
                        </Field>
                    </div>

                    {(!address.country || address.country === 'RO') ? (
                        <>
                            <div className="col-span-2">
                                <JudetSelector label="Județ" value={address.judet} onChange={v => onAddr("judet", v)} />
                                {errors["address.judet"] && <p className="checkout-error-message" style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--error)' }}>{errors["address.judet"]}</p>}
                            </div>
                            <div className="col-span-2">
                                <LocalitateSelector label="Localitate" judet={address.judet} value={address.localitate} onChange={v => onAddr("localitate", v)} onPostCodeChange={pc => onAddr("postCode", pc)} />
                                {errors["address.localitate"] && <p className="checkout-error-message" style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--error)' }}>{errors["address.localitate"]}</p>}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-span-2">
                                {address.country && COUNTRY_REGIONS[address.country] ? (
                                    <Field id="address.judet" label="Regiune / Stat" error={errors["address.judet"]}>
                                        <select className={inputCls(errors["address.judet"])} value={address.judet} onChange={e => onAddr("judet", e.target.value)}>
                                            <option value="">Selectează regiunea</option>
                                            {COUNTRY_REGIONS[address.country].map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </Field>
                                ) : (
                                    <Field id="address.judet" label="Regiune / Stat" error={errors["address.judet"]}>
                                        <input className={inputCls(errors["address.judet"])} value={address.judet} onChange={e => onAddr("judet", e.target.value)} placeholder="Regiune" />
                                    </Field>
                                )}
                            </div>
                            <div className="col-span-2">
                                <Field id="address.localitate" label="Oraș / Localitate" error={errors["address.localitate"]}>
                                    <input className={inputCls(errors["address.localitate"])} value={address.localitate} onChange={e => onAddr("localitate", e.target.value)} placeholder="Oraș" />
                                </Field>
                            </div>
                        </>
                    )}

                    <div className="col-span-3">
                        <Field id="address.strada_nr" label="Adresă" error={errors["address.strada_nr"]}>
                            <input className={inputCls(errors["address.strada_nr"])} value={address.strada_nr} onChange={(e) => onAddr("strada_nr", e.target.value)} placeholder="Stradă, număr, bloc..." />
                        </Field>
                    </div>
                    <div className="col-span-1">
                        <Field id="address.postCode" label="Cod poștal">
                            <input className={inputCls()} value={address.postCode || ""} onChange={(e) => onAddr("postCode", e.target.value)} placeholder="000000" />
                        </Field>
                    </div>
                </div>
            </div>

            {/* 2. FACTURARE */}
            <div style={{ background: 'white', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>2</span>
                    Detalii Facturare
                </h2>

                <div style={{ display: 'flex', width: '100%', marginBottom: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.25rem', background: '#f8fafc', maxWidth: '400px' }}>
                    <button type="button" onClick={() => onBill("tip_factura", "persoana_fizica")} style={tabStyle(billing.tip_factura === "persoana_fizica")}>Persoană fizică</button>
                    <button type="button" onClick={() => onBill("tip_factura", "persoana_juridica")} style={tabStyle(billing.tip_factura === "persoana_juridica")}>Persoană juridică</button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={sameAsDelivery} onChange={(e) => setSameAsDelivery(e.target.checked)} style={{ width: '20px', height: '20px', borderRadius: '4px', accentColor: 'var(--primary)' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>Adresa de facturare coincide cu cea de livrare</span>
                    </label>
                </div>

                {billing.tip_factura === "persoana_juridica" && (
                    <div style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '2rem' }}>
                        <div className="form-grid">
                            <div className="col-span-2">
                                <Field id="billing.denumire_companie" label="Denumire Companie *" error={errors["billing.denumire_companie"]}>
                                    <input className={inputCls(errors["billing.denumire_companie"])} value={billing.denumire_companie || ""} onChange={e => onBill("denumire_companie", e.target.value)} placeholder="Numele firmei" />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field id="billing.cui" label="CUI / CIF *" error={errors["billing.cui"]}>
                                    <input className={inputCls(errors["billing.cui"])} value={billing.cui || ""} onChange={e => onBill("cui", e.target.value)} placeholder="RO12345678" />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field id="billing.reg_com" label="Reg. Com.">
                                    <input className={inputCls()} value={billing.reg_com || ""} onChange={e => onBill("reg_com", e.target.value)} placeholder="J40/..." />
                                </Field>
                            </div>
                        </div>
                    </div>
                )}

                {!sameAsDelivery && (
                    <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <div className="form-grid">
                            <div className="col-span-2">
                                <Field id="billing.country" label="Țară Facturare">
                                    <select className={inputCls()} value={billing.country || 'RO'} onChange={e => { const c = e.target.value; setBilling(b => ({ ...b, country: c, judet: '', localitate: '' })); }}>
                                        {DPD_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                    </select>
                                </Field>
                            </div>

                            {billing.tip_factura === 'persoana_fizica' && (
                                <div className="col-span-2">
                                    <Field id="billing.name" label="Nume și Prenume" error={errors["billing.name"]}>
                                        <input className={inputCls(errors["billing.name"])} value={billing.name || ""} onChange={e => onBill("name", e.target.value)} />
                                    </Field>
                                </div>
                            )}

                            {(!billing.country || billing.country === 'RO') ? (
                                <>
                                    <div className="col-span-2">
                                        <JudetSelector label="Județ (facturare)" value={billing.judet || ""} onChange={v => onBill("judet", v)} />
                                        {errors["billing.judet"] && <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--error)' }}>{errors["billing.judet"]}</p>}
                                    </div>
                                    <div className="col-span-2">
                                        <LocalitateSelector label="Localitate (facturare)" judet={billing.judet || ""} value={billing.localitate || ""} onChange={v => onBill("localitate", v)} onPostCodeChange={pc => onBill("postCode", pc)} />
                                        {errors["billing.localitate"] && <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--error)' }}>{errors["billing.localitate"]}</p>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="col-span-2">
                                        {billing.country && COUNTRY_REGIONS[billing.country] ? (
                                            <Field id="billing.judet" label="Regiune (facturare)">
                                                <select className={inputCls()} value={billing.judet || ""} onChange={e => onBill("judet", e.target.value)}>
                                                    <option value="">Alege regiunea</option>
                                                    {COUNTRY_REGIONS[billing.country].map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </Field>
                                        ) : (
                                            <Field id="billing.judet" label="Regiune (facturare)">
                                                <input className={inputCls()} value={billing.judet || ""} onChange={e => onBill("judet", e.target.value)} />
                                            </Field>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <Field id="billing.localitate" label="Oraș (facturare)">
                                            <input className={inputCls()} value={billing.localitate || ""} onChange={e => onBill("localitate", e.target.value)} />
                                        </Field>
                                    </div>
                                </>
                            )}

                            <div className="col-span-3">
                                <Field id="billing.strada_nr" label="Adresă (Sediul social / Domiciliu)" error={errors["billing.strada_nr"]}>
                                    <input className={inputCls(errors["billing.strada_nr"])} value={billing.strada_nr || ""} onChange={e => onBill("strada_nr", e.target.value)} placeholder="Stradă, număr, etc." />
                                </Field>
                            </div>
                            <div className="col-span-1">
                                <Field id="billing.postCode" label="Cod poștal">
                                    <input className={inputCls()} value={billing.postCode || ""} onChange={e => onBill("postCode", e.target.value)} placeholder="000000" />
                                </Field>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Field({ id, label, error, children, disabled }: { id: string; label: string; error?: string; children: React.ReactNode; disabled?: boolean }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.6 : 1 }}>
            <span className="checkout-label">{label}</span>
            {children}
            {error && <p style={{ fontSize: '0.75rem', color: 'var(--error)' }}>{error}</p>}
        </div>
    );
}

const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    border: 'none',
    background: active ? 'white' : 'transparent',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    padding: '0.75rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: active ? 'var(--shadow-sm)' : 'none'
});
