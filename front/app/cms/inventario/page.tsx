'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

interface Permission {
  inventario: { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean };
}

interface InventoryItem {
  id: string;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  descripcion?: string;
  createdAt: string;
}

interface FormData {
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  descripcion: string;
}

function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/verify', { method: 'POST', credentials: 'same-origin' });
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck>
        <InventoryContent />
      </AuthCheck>
    </Suspense>
  );
}

function InventoryContent() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [permissions, setPermissions] = useState<Permission['inventario'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<FormData>({ nombre: '', sku: '', precio: 0, stock: 0, descripcion: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const permRes = await fetch('/api/auth/verify', { method: 'POST', credentials: 'include' });
        const permData = await permRes.json();
        if (permData.valid && permData.user) {
          const userId = permData.user.id;
          const permsRes = await fetch(`/api/permissions?id=${userId}`, { credentials: 'include' });
          const permsData = await permsRes.json();
          if (permsData.docs?.[0]) {
            setPermissions(permsData.docs[0].inventario);
          }
        }
      } catch { }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!permissions?.canRead) return;
    fetchItems();
  }, [permissions?.canRead]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/inventory-items', { credentials: 'include' });
      const data = await res.json();
      setItems(data.docs || []);
    } catch { } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingItem
        ? `/api/inventory-items/${editingItem.id}`
        : '/api/inventory-items';
      const method = editingItem ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ nombre: '', sku: '', precio: 0, stock: 0, descripcion: '' });
        fetchItems();
      }
    } catch { } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar item?')) return;

    try {
      await fetch(`/api/inventory-items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchItems();
    } catch { }
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({ nombre: item.nombre, sku: item.sku, precio: item.precio, stock: item.stock, descripcion: item.descripcion || '' });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ nombre: '', sku: '', precio: 0, stock: 0, descripcion: '' });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button onClick={() => router.push('/cms')} className="text-gray-600 hover:text-gray-900 mr-4">
              ← Volver
            </button>
            <h1 className="text-xl font-bold">Inventario</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Items</h2>
            {permissions?.canCreate && (
              <button
                onClick={openCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + Nuevo
              </button>
            )}
          </div>

          {isLoading ? (
            <p>Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-600">No hay items.</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                    {(permissions?.canUpdate || permissions?.canDelete) && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.precio}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {permissions?.canUpdate && (
                          <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline mr-3">
                            Editar
                          </button>
                        )}
                        {permissions?.canDelete && (
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Item' : 'Nuevo Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}