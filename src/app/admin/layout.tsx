import React from 'react';
import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';
import AdminSidebar from '@/components/AdminSidebar';

export const metadata = {
  title: 'Sale50 Admin',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  if (!session) {
      return (
          <div style={{ minHeight: '100vh', background: '#0f172a' }}>
              {children}
          </div>
      );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#f8fafc', color: '#1e293b' }}>
        <aside style={{ height: '100vh' }}>
            <AdminSidebar />
        </aside>
        <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
            {children}
        </main>
    </div>
  );
}
