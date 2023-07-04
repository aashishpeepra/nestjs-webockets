import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import Message from './message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {
    console.log('initialized controller');
  }

  @Get()
  async getAllMessages(): Promise<Message[]> {
    console.log('called');
    return await this.messageService.getAllMessages();
  }

  @Get(':id')
  async getMessageById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Message> {
    return await this.messageService.getMessageById(id);
  }

  @Post()
  async createMessage(@Body('content') content: string) {
    return await this.messageService.createMessage(content);
  }
}
