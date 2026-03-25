"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Localitate = { id: number; name: string; municipality?: string; region?: string; postCode?: string };

type Props = {
    judet: string;
    value: string;
    onChange: (v: string) => void;
    onPostCodeChange?: (pc: string) => void;
    label?: string;
    disabled?: boolean;
};

export default function LocalitateSelector({ judet, value, onChange, onPostCodeChange, label = "Localitate", disabled }: Props) {
    const [items, setItems] = useState<Localitate[]>([]);
    const [loading, setLoading] = useState(false);
    const lastJudet = useRef<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!judet) { setItems([]); return; }
            setLoading(true);
            try {
                const params = new URLSearchParams({ judet });
                const res = await fetch(`/api/dpd/localitati?${params.toString()}`, { cache: 'no-store' });
                const data = await res.json().catch(() => null);
                if (!cancelled && data?.ok && Array.isArray(data.localitati)) {
                    setItems(data.localitati as Localitate[]);
                }
            } catch { }
            finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [judet]);

    useEffect(() => {
        if (lastJudet.current !== judet) {
            onChange("");
            onPostCodeChange?.("");
            lastJudet.current = judet;
        }
    }, [judet]);

    const displayItems = useMemo(() => items, [items]);
    const selected = useMemo(() => displayItems.find(i => i.name === value) || null, [displayItems, value]);

    useEffect(() => {
        if (selected?.postCode) onPostCodeChange?.(selected.postCode);
    }, [selected?.postCode]);

    return (
        <div className="text-sm block">
            <span className="mb-1.5 block font-bold text-slate-700 dark:text-slate-200">{label}</span>
            <select
                className="w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:ring-emerald-500 placeholder-slate-400 transition-all font-medium disabled:opacity-60"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!judet || disabled || loading}
            >
                <option value="" disabled>— selectează o localitate —</option>
                {displayItems.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                        {loc.name}{loc.postCode ? ` (CP ${loc.postCode})` : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}
