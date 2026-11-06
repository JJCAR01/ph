import type { Request } from 'express';
import type { Role } from '../entities/role.entity.js';

export interface AuthenticatedUser {
  id: string;
  phId: string | null;
  email: string;
  isActived: boolean;
  lastLogin: Date | null;
  userRoles: Array<{ role: Pick<Role, 'id' | 'phId' | 'name' | 'description'> }>;
}

export interface AuthenticatedRequest extends Request {
  authUser?: AuthenticatedUser;
}
