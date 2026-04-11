import { isAdminFieldLevel } from '@/acess/isAdmin'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
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
      options:[
        {label: 'User', value: 'user'},
        {label: 'Admin', value: 'admin'},
      ],
      saveToJWT: true,
      access:{
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      }
    }
  ],
}
