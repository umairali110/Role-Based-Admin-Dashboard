import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ default: 'user' })
  role!: 'admin' | 'user';

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

@Column({
  type: 'varchar',
  nullable: true,
})
otp!: string | null;

@Column({
  default: false,
})
isVerified!: boolean;

@Column({
  type: 'timestamp',
  nullable: true,
})
otpExpires!: Date | null;
}