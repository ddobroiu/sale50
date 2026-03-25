import { NextResponse } from "next/server";
import { getAllSitesRO } from "@/lib/services";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const judet = searchParams.get("judet");
    if (!judet) return NextResponse.json({ ok: false, message: "Missing judet" }, { status: 400 });

    const sites = await getAllSitesRO();
    const localitati = sites.filter(s => s.region?.toLowerCase() === judet.toLowerCase()).sort((a, b) => a.name.localeCompare(b.name));
    
    return NextResponse.json({ ok: true, localitati });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
