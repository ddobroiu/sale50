"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";

type Props = {
    judet: string;
    value: string;
    onChange: (v: string) => void;
    onPostCodeChange?: (pc: string) => void;
    label?: string;
    disabled?: boolean;
};

export default function LocalitateSelector({ judet, value, onChange, onPostCodeChange, label = "Localitate", disabled }: Props) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const lastJudet = useRef<string | null>(null);

    useEffect(() => {
        if (lastJudet.current !== judet) {
            onChange("");
            onPostCodeChange?.("");
            lastJudet.current = judet;
        }
    }, [judet]);

    useEffect(() => {
        if (!judet) { setItems([]); return; }
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/dpd/localitati?judet=${encodeURIComponent(judet)}`);
                const data = await res.json();
                if (data?.ok) setItems(data.localitati);
            } catch { } finally { setLoading(false); }
        }
        load();
    }, [judet]);

    const selected = useMemo(() => items.find(i => i.name === value) || null, [items, value]);

    useEffect(() => {
        if (selected?.postCode) onPostCodeChange?.(selected.postCode);
    }, [selected?.postCode]);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!judet || disabled || loading}
                style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'white',
                    outline: 'none',
                    fontSize: '1rem'
                }}
            >
                <option value="" disabled>— selectează localitatea —</option>
                {items.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                        {loc.name}{loc.postCode ? ` (CP ${loc.postCode})` : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}
