import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message])
  async getLastMessages(
    @Args('room') room: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.messageService.getLastMessages(room, limit);
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args('content') content: string,
    @Args('senderId', { type: () => Int }) senderId: number,
    @Args('room') room: string,
  ) {
    return this.messageService.saveMessage(content, senderId, room);
  }
}
