import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function checkPermission(permission: string, action: 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete') {
  const cookieStore = await cookies();
  const payloadToken = cookieStore.get('payload-token');

  if (!payloadToken?.value) {
    return null;
  }

  const verifyRes = await fetch('http://localhost:3000/api/users/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${payloadToken.value}`,
    },
  });

  const userData = await verifyRes.json();
  if (!userData.user) {
    return null;
  }

  const permsRes = await fetch(
    `http://localhost:3000/api/permissions?id=${userData.user.id}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${payloadToken.value}`,
      },
    }
  );

  const permsData = await permsRes.json();
  return permsData.docs?.[0]?.[permission]?.[action] ? userData.user : null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await checkPermission('inventario', 'canRead');
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');

    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.toString();

    const backendRes = await fetch(
      `http://localhost:3000/api/inventory-items${queryParams ? `?${queryParams}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${payloadToken?.value}`,
        },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Error fetching items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await checkPermission('inventario', 'canCreate');
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');
    const body = await request.json();

    const backendRes = await fetch('http://localhost:3000/api/inventory-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${payloadToken?.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.ok ? 201 : 400 });
  } catch {
    return NextResponse.json({ message: 'Error creating item' }, { status: 500 });
  }
}