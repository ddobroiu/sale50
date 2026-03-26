import { NextRequest, NextResponse } from 'next/server';
import { listInvoices } from '@/lib/products';
import { verifyAdminSession } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    if (!await verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

    const invoices = await listInvoices();
    return NextResponse.json({ ok: true, invoices });
}
