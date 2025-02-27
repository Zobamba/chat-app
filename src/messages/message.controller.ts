import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getLastMessages(@Query('room') room: string) {
    return this.messageService.getLastMessages(room);
  }

  @Post()
  async saveMessage(
    @Body('content') content: string,
    @Body('senderId') senderId: number,
    @Body('room') room: string,
  ) {
    return this.messageService.saveMessage(content, senderId, room);
  }
}
