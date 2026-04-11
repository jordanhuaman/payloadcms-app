import { Access, FieldAccess } from "payload";
import { User } from "../payload-types";

export const isAdmin: Access = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'));
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'));
}

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return { user: { equals: user?.id } }
}
export const adminOrUser: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return {
    id: {
      equals: user?.id,
    },
  }
}