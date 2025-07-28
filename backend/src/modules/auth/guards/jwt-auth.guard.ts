import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.jwt || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No autenticado');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      // Mapear 'sub' a 'id' para mantener compatibilidad
      req['user'] = {
        ...payload,
        id: payload.sub
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
} 