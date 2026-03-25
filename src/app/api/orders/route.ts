import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/products";
import { getOblioAccessToken, createOblioInvoice } from "@/lib/services";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, shipping, billing, items, total, shippingFee, paymentMethod } = body;

    // 1. Save to Database
    const { id } = await saveOrder({
      name, email, phone, shipping, billing, items, total, shippingFee, paymentMethod
    });

    // 2. Oblio Invoicing
    let invoiceUrl = null;
    try {
      const token = await getOblioAccessToken();
      const products = items.map((it: any) => ({
        name: it.name,
        price: it.price,
        measuringUnitName: 'buc',
        vatName: 'Normala',
        quantity: it.quantity
      }));

      const clientName = billing.type === 'pj' ? billing.companyName : name;
      const clientCif = billing.type === 'pj' ? billing.cui : null;

      const invoiceResp = await createOblioInvoice({
        cif: process.env.OBLIO_CIF_FIRMA,
        client: {
          name: clientName,
          address: `${shipping.judet}, ${shipping.localitate}, ${shipping.address}`,
          email: email,
          phone: phone,
          cif: clientCif
        },
        issueDate: new Date().toISOString().slice(0, 10),
        seriesName: process.env.OBLIO_SERIE_FACTURA,
        documentType: 'Factura',
        products: products
      }, token);

      invoiceUrl = invoiceResp?.data?.link || invoiceResp?.link || null;
      console.log("Oblio Invoice Created:", invoiceUrl);
    } catch (oblioErr) {
      console.error("Oblio Error:", oblioErr);
    }

    return NextResponse.json({ ok: true, orderId: id, invoiceUrl });
  } catch (e: any) {
    console.error("Checkout Error:", e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
