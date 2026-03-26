import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, updateProduct, deleteProductBySku } from '@/lib/products';
import { verifyAdminSession } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    if (!await verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const data = await getProducts(page, category, search);
    return NextResponse.json({ ok: true, ...data });
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    if (!await verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json();
    await createProduct(body);
    return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    if (!await verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json();
    const { sku, ...data } = body;
    await updateProduct(sku, data);
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    if (!await verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sku = searchParams.get('sku');
    if (!sku) return NextResponse.json({ ok: false }, { status: 400 });

    await deleteProductBySku(sku);
    return NextResponse.json({ ok: true });
}
