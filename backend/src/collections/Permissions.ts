import { adminOrSelf } from '@/acess/isAdmin'
import type { CollectionConfig, Access } from 'payload'

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: 'user',
  },
  access: {
    read: adminOrSelf,
    create: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    update: adminOrSelf,
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
    },
    {
      name: 'cobranzas',
      type: 'group',
      fields: [
        { name: 'canRead', type: 'checkbox', defaultValue: false },
        { name: 'canCreate', type: 'checkbox', defaultValue: false },
        { name: 'canUpdate', type: 'checkbox', defaultValue: false },
        { name: 'canDelete', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'ventas',
      type: 'group',
      fields: [
        { name: 'canRead', type: 'checkbox', defaultValue: false },
        { name: 'canCreate', type: 'checkbox', defaultValue: false },
        { name: 'canUpdate', type: 'checkbox', defaultValue: false },
        { name: 'canDelete', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'inventario',
      type: 'group',
      fields: [
        { name: 'canRead', type: 'checkbox', defaultValue: false },
        { name: 'canCreate', type: 'checkbox', defaultValue: false },
        { name: 'canUpdate', type: 'checkbox', defaultValue: false },
        { name: 'canDelete', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
