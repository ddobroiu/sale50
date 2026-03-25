import { NextRequest, NextResponse } from 'next/server';
import { signAdminSession } from '@/lib/adminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const password = body?.pass || '';
    const expected = process.env.ADMIN_PASSWORD || "sale50admin";

    if (password !== expected) {
      return NextResponse.json({ ok: false, error: 'Parolă incorectă' }, { status: 401 });
    }

    const token = signAdminSession();
    
    const res = NextResponse.json({ ok: true });
    
    res.cookies.set('admin_auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Internal Error' }, { status: 500 });
  }
}
