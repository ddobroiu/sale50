"use client";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
    label?: string;
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
};

const DEFAULT_JUDETE = [
    "Alba", "Arad", "Arges", "Bacau", "Bihor", "Bistrita-Nasaud", "Botosani", "Brasov", "Braila",
    "Bucuresti", "Buzau", "Caras-Severin", "Calarasi", "Cluj", "Constanta", "Covasna", "Dambovita",
    "Dolj", "Galati", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomita", "Iasi", "Ilfov",
    "Maramures", "Mehedinti", "Mures", "Neamt", "Olt", "Prahova", "Satu Mare", "Salaj", "Sibiu",
    "Suceava", "Teleorman", "Timis", "Tulcea", "Vaslui", "Valcea", "Vrancea",
];

export default function JudetSelector({ label = "Județ", value, onChange, disabled }: Props) {
    const [remote, setRemote] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetch("/api/dpd/judete");
                const data = await res.json();
                if (data?.ok) setRemote(data.judete);
            } catch { } finally { setLoading(false); }
        }
        load();
    }, []);

    const list = useMemo(() => remote || DEFAULT_JUDETE, [remote]);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || loading}
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
                <option value="" disabled>— selectează județul —</option>
                {list.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
        </div>
    );
}
