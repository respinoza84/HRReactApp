import {hasIntersectOrLeftEmpty} from './predicateUtility'
import {Role} from '../type/security'
import {ModalRoleEnums} from 'type/user/roles'

export const isRoleAllowed = hasIntersectOrLeftEmpty

export const hasRequiredFeatureRole = (requiredRole: Role | undefined, userRoles: Role[]) =>
  !requiredRole || userRoles.includes(requiredRole)

export const isAllowed = (requiredRoles: ModalRoleEnums[] | undefined, userRoles: ModalRoleEnums[]) =>
  isRoleAllowed(requiredRoles, userRoles)
