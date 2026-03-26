"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Users, FileText, Database, LayoutDashboard, Settings, LogOut, Package } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();

    const menu = [
        { name: 'Comenzi', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Produse', href: '/admin/products', icon: Package },
        { name: 'Utilizatori', href: '/admin/users', icon: Users },
        { name: 'Facturi (Oblio)', href: '/admin/invoices', icon: FileText },
    ];

    return (
        <div style={{ width: '280px', height: '100%', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>SALE50 <span style={{ color: '#3b82f6' }}>ADMIN</span></h2>
            </div>

            <nav style={{ flex: 1, padding: '1.5rem', display: 'grid', gap: '0.5rem', alignContent: 'start' }}>
                {menu.map(item => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} style={{
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1.25rem', borderRadius: '12px',
                            textDecoration: 'none', color: active ? 'white' : '#94a3b8',
                            background: active ? '#3b82f6' : 'transparent',
                            fontWeight: 600, transition: 'all 0.2s'
                        }}>
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid #334155' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1.25rem', textDecoration: 'none', color: '#ef4444', fontWeight: 600 }}>
                    <LogOut size={20} />
                    Ieșire Store
                </Link>
            </div>
        </div>
    );
}
