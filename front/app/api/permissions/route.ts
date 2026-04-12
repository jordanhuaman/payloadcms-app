import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL } from '../../../lib/api';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');

    if (!payloadToken?.value) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    const backendRes = await fetch(
      `${API_URL}/api/permissions?id=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${payloadToken.value}`,
        },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Error fetching permissions' }, { status: 500 });
  }
}