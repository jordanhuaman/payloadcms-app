import { adminOrSelf, adminOrUser, isAdminFieldLevel } from '@/acess/isAdmin'
import { access } from 'fs'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: adminOrUser,
    update: isAdminFieldLevel,
    delete: isAdminFieldLevel,
    create: isAdminFieldLevel
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      saveToJWT: true,
    },

  ],
}
