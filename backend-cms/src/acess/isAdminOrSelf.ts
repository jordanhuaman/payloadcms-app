import { Access } from "payload";

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    if (user.roles?.includes('admin')) {
      return true;
    }

    // If any other type of user, only provide access to themselves
    return {
      id: {
        equals: user.id,
      }
    }
  }

  // Reject everyone else
  return false;
}

export const isAdminByUserIdRelation: Access = ({ req: { user } }) => {
  if (!user) return false

  if (user.roles?.includes('admin')) return true

  return {
    'user.id': {
      equals: user.id,
    },
  }
}