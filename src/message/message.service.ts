import Message from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(content: string) {
    const newMessage = await this.messageRepository.create({ content });
    await this.messageRepository.save(newMessage);
    return newMessage;
  }

  async getAllMessages() {
    return await this.messageRepository.find();
  }

  async getMessageById(id: number) {
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    if (message) return message;
    throw new NotFoundException('Could not find the message');
  }
}
