import { Request } from 'express';
import { RoleType } from '@prisma/client';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    roles: RoleType[];
  };
}
