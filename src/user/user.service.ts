import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository, LessThan } from 'typeorm';
import * as moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userName: string, deviceId: string) {
    const newTime = moment().add(2, 'minutes');
    const newUser = await this.userRepository.create({
      userName,
      nextPaymentDate: newTime,
      deviceId,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getAllNonPaidUsers() {
    return await this.userRepository.find({
      where: {
        nextPaymentDate: LessThan(new Date()),
      },
    });
  }

  async updateDeviceIdForUser(userName: string, deviceId: string) {
    const currentUser = await this.userRepository.find({
      where: {
        userName,
      },
    });

    if (!currentUser || !currentUser?.length)
      return await this.createUser(userName, deviceId);

    return await this.userRepository.update(
      { id: currentUser[0].id },
      { deviceId },
    );
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async sendNotificationToUser() {}
}
