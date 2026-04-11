import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');

    if (!payloadToken?.value) {
      return NextResponse.json({ valid: false, message: 'No token' }, { status: 401 });
    }

    const backendRes = await fetch('http://localhost:3000/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${payloadToken.value}`,
      },
    });

    const data = await backendRes.json();
    console.log('Verification response:', data);

    if (!data?.user) {
      return NextResponse.json(
        { valid: false, message: data?.message || 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true, user: data.user });
  } catch {
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}