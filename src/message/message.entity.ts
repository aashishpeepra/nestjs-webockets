import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;
}

export default Message;
