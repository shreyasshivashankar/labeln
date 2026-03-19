import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET || 'dev-secret');

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 503 });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

/** GET — verify current admin session */
export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

/** DELETE — logout */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
