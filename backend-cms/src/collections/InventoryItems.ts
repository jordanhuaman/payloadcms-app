import { isAdmin } from '@/acess/isAdmin';
import { isAdminOrSelf } from '@/acess/isAdminOrSelf';
import { inventarioCreate, inventarioDelete, inventarioRead, inventarioUpdate } from '@/acess/isAllowedActionInventory';
import { CollectionConfig } from 'payload';

export const InventoryItems: CollectionConfig = {
  slug: 'inventory-items',
  admin: {
    useAsTitle: "nombre"
  },
  access: {
    create: inventarioCreate,
    read: inventarioRead,
    update: inventarioUpdate,
    delete: inventarioDelete,
  },
  fields: [
    { name: 'nombre', type: 'text', required: true },
    { name: 'sku', type: 'text', required: true },
    { name: 'precio', type: 'number', required: true },
    { name: 'stock', type: 'number', required: true },
    { name: 'imagen', type: 'upload', relationTo: 'media' },
    { name: 'descripcion', type: 'textarea' },
  ],
  timestamps: true
}
