import { isAdmin } from '@/acess/isAdmin';
import { isAdminByUserIdRelation, isAdminOrSelf } from '@/acess/isAdminOrSelf';
import { access, read } from 'fs';
import { CollectionConfig } from 'payload';

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: "user"
  },
  access: {
    create: isAdmin,
    read: isAdminByUserIdRelation,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: "user", type: "relationship", relationTo: "users", hasMany: true, required: true },
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