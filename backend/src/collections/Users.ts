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
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options:[
        {label: 'User', value: 'user'},
        {label: 'Admin', value: 'admin'},
      ],
      saveToJWT: true,
      access:{
        create: () => false,
        update: ({req})=> req.user?.role === 'admin',
      }
    }
  ],
}
