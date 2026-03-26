import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/products';
import { createShipment, printExtended, type CreateShipmentRequest } from '@/lib/dpdService';
import { verifyAdminSession } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: orderId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_auth')?.value;
        if (!verifyAdminSession(token)) return NextResponse.json({ ok: false }, { status: 401 });

        const pool = getPool();
        const orderRes = await pool.query('SELECT * FROM sale50_orders WHERE id = $1', [orderId]);
        if (orderRes.rows.length === 0) return NextResponse.json({ ok: false, error: 'Comanda nu există' }, { status: 404 });

        const order = orderRes.rows[0];
        const addr = order.shipping_address;
        const items = order.items;

        // Determine if COD is needed
        const isRamburs = (order.payment_method || '').toLowerCase().includes('ramburs');
        const codAmount = isRamburs ? order.total_amount : 0;

        const shipmentRequest: CreateShipmentRequest = {
            recipient: {
                clientName: order.customer_name,
                contactName: order.customer_name,
                email: order.customer_email,
                phone1: { number: order.customer_phone },
                privatePerson: true,
                address: {
                    countryId: 642, // RO
                    siteName: addr.localitate,
                    postCode: addr.postCode,
                    addressNote: `${addr.strada_nr}, ${addr.localitate}, ${addr.judet}, RO`
                },
            },
            service: {
                serviceId: parseInt(process.env.DPD_DEFAULT_SERVICE_ID || '2505'),
                autoAdjustPickupDate: true,
                additionalServices: codAmount > 0 ? { cod: { amount: codAmount, currencyCode: 'RON' } } : undefined
            },
            content: {
                parcelsCount: 1,
                totalWeight: 1,
                contents: items.map((it: any) => `${it.name} x${it.quantity}`).join(', ').substring(0, 100),
                package: 'Pachet'
            },
            payment: { courierServicePayer: 'SENDER' }
        };

        const created = await createShipment(shipmentRequest);
        if (created.error) {
            return NextResponse.json({ ok: false, error: created.error.message }, { status: 500 });
        }

        const awb = created.id!;
        await pool.query('UPDATE sale50_orders SET awb_number = $1, awb_carrier = $2 WHERE id = $3', [awb, 'DPD', orderId]);

        return NextResponse.json({ ok: true, awb });
    } catch (e: any) {
        console.error("AWB GEN ERROR:", e);
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
