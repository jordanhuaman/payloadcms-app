import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';

async function checkPermission(permission: string, action: 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete') {
  const cookieStore = await cookies();
  const payloadToken = cookieStore.get('payload-token');

  if (!payloadToken?.value) {
    return null;
  }

  const verifyRes = await fetch('API_URL/api/users/me', {
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
    `API_URL/api/permissions?id=${userData.user.id}`,
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

    const id = request.nextUrl.pathname.split('/').pop();
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');

    const backendRes = await fetch(
      `API_URL/api/inventory-items/${id}`,
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
    return NextResponse.json({ message: 'Error fetching item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await checkPermission('inventario', 'canUpdate');
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop();
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');
    const body = await request.json();

    const backendRes = await fetch(
      `API_URL/api/inventory-items/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${payloadToken?.value}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ message: 'Error updating item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token');

    if (!payloadToken?.value) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const verifyRes = await fetch('API_URL/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${payloadToken.value}`,
      },
    });

    const userData = await verifyRes.json();

    if (!userData.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const permsRes = await fetch(
      `API_URL/api/permissions?id=${userData.user.id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${payloadToken.value}`,
        },
      }
    );

    const permsData = await permsRes.json();
    const canDelete = permsData.docs?.[0]?.inventario?.canDelete;

    if (!canDelete) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop();

    const backendRes = await fetch(
      `API_URL/api/inventory-items/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `JWT ${payloadToken.value}`,
        },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.ok ? 200 : 400 });
  } catch (err) {
    console.error('DELETE - Error:', err);
    return NextResponse.json({ message: 'Error deleting item' }, { status: 500 });
  }
}