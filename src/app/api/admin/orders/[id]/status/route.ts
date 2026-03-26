import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/products';
import { verifyAdminSession } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: orderId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_auth')?.value;
        if (!await verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

        const { status } = await req.json();
        if (!status) return NextResponse.json({ ok: false, error: 'Status missing' }, { status: 400 });

        await updateOrderStatus(orderId, status);
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error("STATUS UPDATE ERROR:", e);
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
