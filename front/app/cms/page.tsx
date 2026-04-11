'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

interface Permission {
  cobranzas: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
  ventas: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
  inventario: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
}

function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          credentials: 'same-origin',
        });

        const data = await res.json();

        if (!data.valid) {
          router.push('/login');
          return;
        }

        setIsAuthenticated(true);
      } catch {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

export default function CMSPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck>
        <CMSContent />
      </AuthCheck>
    </Suspense>
  );
}

function CMSContent() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; id?: string } | null>(null);
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [isLoadingPerms, setIsLoadingPerms] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.valid && data.user) {
          setUser(data.user);
        }
      } catch { }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPermissions = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/permissions?id=${user.id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.docs?.[0]) {
          setPermissions(data.docs[0]);
        }
      } catch { } finally {
        setIsLoadingPerms(false);
      }
    };

    fetchPermissions();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch { }
    router.push('/login');
  };

  const modules = [
    { key: 'cobranzas', label: 'Cobranzas', canRead: permissions?.cobranzas?.canRead },
    { key: 'ventas', label: 'Ventas', canRead: permissions?.ventas?.canRead },
    { key: 'inventario', label: 'Inventario', canRead: permissions?.inventario?.canRead },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">CMS Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-semibold mb-4">Módulos</h2>
          {isLoadingPerms ? (
            <p className="text-gray-600">Cargando permisos...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {modules.map((mod) => (
                mod.canRead ? (
                  <button
                    key={mod.key}
                    onClick={() => router.push(`/cms/${mod.key}`)}
                    className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">{mod.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">Ir a {mod.label}</p>
                  </button>
                ) : null
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}