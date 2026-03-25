import { NextResponse } from "next/server";
import { getAllSitesRO } from "@/lib/services";

export async function GET() {
  try {
    const sites = await getAllSitesRO();
    const judete = [...new Set(sites.map(s => s.region).filter(Boolean))].sort();
    return NextResponse.json({ ok: true, judete });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
