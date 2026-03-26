import { NextRequest, NextResponse } from 'next/server';
import { listOrders } from '@/lib/products';
import { verifyAdminSession } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_auth')?.value;
        const session = await verifyAdminSession(token);

        if (!session) {
            return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await listOrders();
        return NextResponse.json({ ok: true, orders });
    } catch (e) {
        console.error("ADMIN ORDERS ERROR:", e);
        return NextResponse.json({ ok: false, error: 'Error fetching orders' }, { status: 500 });
    }
}
