import { CollectionConfig } from 'payload';

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: "user",
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true
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
  ]
}