import { Access } from 'payload'


const isAdmin = (user: any): boolean => {
  console.log('[DEBUG] isAdmin - user id:', user?.id, 'email:', user?.email, 'roles:', user?.roles)
  if (!user) return false
  if (!user?.roles) return false
  if (Array.isArray(user.roles)) {
    return user.roles.includes('admin')
  }
  return user.roles === 'admin'
}

const inventarioRead: Access = async ({ req }) => {
  const { user } = req
  if (!user) return false
  if (isAdmin(user)) return true
  const { payload } = req
  const perms = await payload.find({
    collection: 'permissions',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })
  if (!perms.docs[0]) return false
  const mp = perms.docs[0].inventario as Record<string, boolean> | undefined
  return mp?.canRead === true
}

const inventarioCreate: Access = async ({ req }) => {
  const { user } = req
  if (!user) return false
  if (isAdmin(user)) return true
  const { payload } = req
  const perms = await payload.find({
    collection: 'permissions',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })
  if (!perms.docs[0]) return false
  const mp = perms.docs[0].inventario as Record<string, boolean> | undefined
  return mp?.canCreate === true
}

const inventarioUpdate: Access = async ({ req }) => {
  const { user } = req
  if (!user) return false
  if (isAdmin(user)) return true
  const { payload } = req
  const perms = await payload.find({
    collection: 'permissions',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })
  if (!perms.docs[0]) return false
  const mp = perms.docs[0].inventario as Record<string, boolean> | undefined
  return mp?.canUpdate === true
}

const inventarioDelete: Access = async ({ req }) => {
  const { user } = req
  if (!user) return false
  if (isAdmin(user)) return true
  const { payload } = req
  const perms = await payload.find({
    collection: 'permissions',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })
  if (!perms.docs[0]) return false
  const mp = perms.docs[0].inventario as Record<string, boolean> | undefined
  return mp?.canDelete === true
}


export {
  isAdmin,
  inventarioRead,
  inventarioCreate,
  inventarioUpdate,
  inventarioDelete,
}