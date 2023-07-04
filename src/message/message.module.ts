import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageGateWay } from './message.gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateWay],
})
export default class MessageModule {}
