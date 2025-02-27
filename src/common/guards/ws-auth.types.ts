import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    username: string;
  };
}

export interface JwtPayload {
  id: number;
  username: string;
}
