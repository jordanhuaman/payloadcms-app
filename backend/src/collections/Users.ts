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
    update: () => true,
    delete: isAdminFieldLevel,
    create: () => true
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
      access: {
        update: isAdminFieldLevel
      }
    },

  ],
}
