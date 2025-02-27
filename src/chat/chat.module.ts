import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MessageModule } from 'src/messages/message.module';

@Module({
  providers: [ChatGateway],
  imports: [JwtModule.register({}), MessageModule],
  exports: [ChatGateway],
})
export class ChatModule {}
