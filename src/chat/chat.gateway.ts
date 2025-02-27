import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/common/guards/ws-auth.guard';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatSocket } from './chat.types';
import { MessageService } from 'src/messages/message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private users: Record<
    string,
    { username: string; room?: string; id: number }
  > = {};

  constructor(
    private jwtService: JwtService,
    private messageService: MessageService,
  ) {}

  handleConnection(client: ChatSocket) {
    try {
      const token = client.handshake.query.token as string;
      if (!token) throw new Error('No token provided');

      const decoded = this.jwtService.verify<{ sub: number; username: string }>(
        token,
        { secret: process.env.JWT_SECRET },
      );

      if (!decoded.sub || !decoded.username) {
        throw new Error('Invalid token payload');
      }

      this.users[client.id] = {
        id: decoded.sub,
        username: decoded.username,
      };

      console.log(`Client connected: ${client.id} (User: ${decoded.username})`);
      client.emit('message', { text: 'Welcome! Select a room to join.' });
    } catch (error) {
      console.error(
        'WebSocket authentication failed:',
        error instanceof Error ? error.message : error,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const user = this.users[client.id];

    if (user?.room) {
      this.server.to(user.room).emit('message', {
        text: `${user.username} left the room`,
      });
    }
    delete this.users[client.id];
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.users[client.id];
    if (!user) return;

    if (user.room) {
      await client.leave(user.room);
    }

    await client.join(data.room);
    user.room = data.room;

    console.log(`${user.username} joined room: ${data.room}`);

    this.server.to(data.room).emit('message', {
      text: `${user.username} joined the room`,
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.users[client.id];
    if (!user || !user.room) {
      console.error('User not in a room:', client.id);
      return;
    }

    const savedMessage = await this.messageService.saveMessage(
      data.text,
      user.id,
      user.room,
    );

    this.server.to(user.room).emit('message', {
      id: savedMessage.id,
      senderId: user.id,
      text: data.text,
      createdAt: savedMessage.createdAt.toISOString(),
    });

    console.log(`Message sent in ${user.room}: ${data.text}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const user = this.users[client.id];
    if (!user || !user.room) return;

    await client.leave(user.room);

    this.server.to(user.room).emit('message', {
      text: `${user.username} left the room`,
    });

    delete this.users[client.id];
    console.log(`${user.username} left room: ${user.room}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getActiveUsers')
  handleGetUsers(@ConnectedSocket() client: Socket) {
    const activeUsers = Object.values(this.users)
      .filter((user) => !!user.room)
      .map((user) => user.username);

    client.emit('activeUsers', activeUsers);
  }
}
