import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { tenantStorage } from './tenant.storage';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let companyId: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded && decoded.role !== 'SUPER_ADMIN' && decoded.companyId) {
          companyId = decoded.companyId;
        }
      } catch (e) {
        // Ignore, passport will handle real validation later
      }
    }

    if (companyId) {
      tenantStorage.run({ companyId }, () => {
        next();
      });
    } else {
      next(); // Run without tenant context (for public routes or login)
    }
  }
}
