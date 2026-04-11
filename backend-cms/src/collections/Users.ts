import { isAdmin } from '@/acess/isAdmin'
import { isAdminByUserIdRelation, isAdminOrSelf } from '@/acess/isAdminOrSelf'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['User'],
      access: {
        // Only admins can create or update a value for this field
        create: () => true,
        update: () => true,
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'User',
        },
      ]
    },
  ],
}
