import type { CollectionConfig, Access } from 'payload'

const checkPermission = async ({
  req,
  module,
  flag,
}: {
  req: any
  module: string
  flag: string
}): Promise<boolean> => {
  const { user, payload } = req
  if (!user) return false

  if (user.roles?.includes('admin')) return true

  const permissions = await payload.find({
    collection: 'permissions',
    where: { user: { equals: user.id } },
    limit: 1,
  })

  if (!permissions.docs[0]) return false

  const modulePerms = permissions.docs[0][module as keyof (typeof permissions.docs)[0]] as
    | Record<string, boolean>
    | undefined
  if (!modulePerms) return false

  return modulePerms[flag] === true
}

const inventarioRead: Access = async ({ req }) => {
  return checkPermission({ req, module: 'inventario', flag: 'canRead' })
}

const inventarioCreate: Access = async ({ req }) => {
  return checkPermission({ req, module: 'inventario', flag: 'canCreate' })
}

const inventarioUpdate: Access = async ({ req }) => {
  return checkPermission({ req, module: 'inventario', flag: 'canUpdate' })
}

const inventarioDelete: Access = async ({ req }) => {
  return checkPermission({ req, module: 'inventario', flag: 'canDelete' })
}

export const InventoryItems: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'sku', 'precio', 'stock'],
  },
  access: {
    read: inventarioRead,
    create: inventarioCreate,
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
  timestamps: true,
}
