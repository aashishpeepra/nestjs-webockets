import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class MessageGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  temp: () => void = () => {};

  private logger: Logger = new Logger('MessageGateway');

  async sendNotificationToAllUnPaidUSers(client) {
    const allUnPaidUsers = await this.userService.getAllNonPaidUsers();
    allUnPaidUsers.forEach((user) => {
      client.broadcast
        .to(user.deviceId)
        .emit('userNotifs', `alert('${user.userName} please pay the fee')`);
    });
  }

  @WebSocketServer() wss: Socket;

  afterInit(client) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.sendNotificationToAllUnPaidUSers(client);
    this.temp = () => this.sendNotificationToAllUnPaidUSers(client);
    this.logger.log(`Client Disconnected ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: string): Promise<void> {
    const newMessage = await this.messageService.createMessage(payload);
    this.wss.emit('receivedMessage', newMessage);
  }

  @SubscribeMessage('setUser')
  async setUser(client: Socket, payload: string): Promise<void> {
    const user = await this.userService.updateDeviceIdForUser(
      payload,
      client.id,
    );
    console.log(user);
    this.wss.emit('userSet', user);
  }
}
