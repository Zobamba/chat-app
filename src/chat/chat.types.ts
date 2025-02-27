import { Socket } from 'socket.io';
import { JwtPayload } from 'src/common/guards/ws-auth.types';

export interface ChatSocket extends Socket {
  data: {
    room?: string;
    user?: JwtPayload;
  };
}
