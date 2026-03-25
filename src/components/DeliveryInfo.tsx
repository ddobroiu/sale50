"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Truck } from "lucide-react";

type EtaResponse = {
    ok: boolean;
    county: string;
    minDate: string;
    maxDate: string;
    label: string;
};

type Props = {
    county?: string;
    country?: string;
    className?: string;
    variant?: "default" | "minimal";
};

export default function DeliveryInfo({ county, country, className = "", variant = "default" }: Props) {
    const [data, setData] = useState<EtaResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const query = useMemo(() => new URLSearchParams({
        county: county || "",
        country: country || ""
    }).toString(), [county, country]);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/eta?${query}`, { cache: "no-store" });
                const json = await res.json();
                if (!cancelled) setData(json);
            } catch (e) {
                if (!cancelled) setData(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [query]);

    const label = data?.label || "1–2 zile lucrătoare";

    if (variant === "minimal") {
        return (
            <div className={`flex items-center gap-2 text-xs font-semibold text-primary ${className}`}>
                <Truck size={14} />
                <span>Livrare estimată: {loading ? "..." : label}</span>
            </div>
        );
    }

    return (
        <div style={{ 
            background: 'white', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--border-color)', 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }} className={className}>
            <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'var(--primary-soft)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--primary)' 
            }}>
                <Truck size={24} />
            </div>
            <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{loading ? "Calculăm livrarea..." : `Livrare estimată în localitatea ta`}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {loading ? "Vă rugăm așteptați..." : (
                        <>Coletul tău ajunge aproximativ între <strong>{label}</strong>.</>
                    )}
                </p>
            </div>
        </div>
    );
}
