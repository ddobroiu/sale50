"use client";
import React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/login', { method: 'DELETE' });
            router.push('/login');
            router.refresh();
        } catch(e) {}
    };

    return (
        <button 
            onClick={handleLogout}
            style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem', 
                background: 'rgba(239, 68, 68, 0.05)', 
                color: '#dc2626', 
                border: '1px solid rgba(239, 68, 68, 0.1)', 
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600
            }}
        >
            <LogOut size={18} /> Ieșire din Cont
        </button>
    );
}
