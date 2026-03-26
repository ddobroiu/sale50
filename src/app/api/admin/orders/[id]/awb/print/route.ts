import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/products';
import { printExtended } from '@/lib/dpdService';
import { verifyAdminSession } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: orderId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_auth')?.value;
        if (!await verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

        const pool = getPool();
        const orderRes = await pool.query('SELECT awb_number FROM sale50_orders WHERE id = $1', [orderId]);
        if (orderRes.rows.length === 0) return NextResponse.json({ ok: false, error: 'Comanda nu există' }, { status: 404 });

        const { awb_number } = orderRes.rows[0];
        if (!awb_number) return NextResponse.json({ ok: false, error: 'Nu este generat niciun AWB' }, { status: 400 });

        const printed = await printExtended({
            paperSize: 'A4',
            parcels: [{ id: awb_number }]
        });
        
        if (printed.error) return NextResponse.json({ ok: false, error: printed.error.message || 'Eroare DPD' }, { status: 500 });
        if (!printed.base64) return NextResponse.json({ ok: false, error: 'DPD nu a returnat conținutul etichetei' }, { status: 500 });

        // DPD returns base64 content
        const pdfBuffer = Buffer.from(printed.base64, 'base64');

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="awb_${awb_number}.pdf"`
            }
        });
    } catch (e: any) {
        console.error("AWB PRINT ERROR:", e);
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
