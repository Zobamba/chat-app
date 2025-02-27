import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getLastMessages(room: string, limit = 50): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { room },
      order: { createdAt: 'ASC' },
      take: limit,
      relations: ['sender'],
    });
  }

  async saveMessage(
    content: string,
    senderId: number,
    room: string,
  ): Promise<Message> {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    if (!sender) throw new Error('Sender not found');

    const message = this.messageRepository.create({ content, sender, room });
    return await this.messageRepository.save(message);
  }
}
