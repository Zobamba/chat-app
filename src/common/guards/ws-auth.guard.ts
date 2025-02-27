import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket, JwtPayload } from './ws-auth.types';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: AuthenticatedSocket = context
      .switchToWs()
      .getClient<AuthenticatedSocket>();
    const token = client.handshake.query.token as string;

    if (!token) return false;

    try {
      const decoded: JwtPayload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      client.user = decoded;
      return true;
    } catch {
      return false;
    }
  }
}
