import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');

    if (!payloadToken?.value) {
      return NextResponse.json({ message: 'No session' }, { status: 400 });
    }

    const backendRes = await fetch(`${API_URL}/api/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${payloadToken.value}`,
      },
    });

    const response = NextResponse.json({ message: 'Logged out' });

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch {
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}