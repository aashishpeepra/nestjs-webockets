import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public userName: string;

  @Column()
  public nextPaymentDate: Date;

  @Column()
  public deviceId: string;
}

export default User;
