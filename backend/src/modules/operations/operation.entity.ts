import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  userName: string;

  @Column({ type: 'varchar', length: 20 })
  userDni: string;

  @Column({ type: 'varchar', length: 20 })
  userPhone: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountToSend: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  exchangeRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountToReceive: number;

  @Column({ type: 'varchar', length: 10 })
  fromCurrency: string;

  @Column({ type: 'varchar', length: 10 })
  toCurrency: string;

  @Column({ type: 'varchar', length: 50 })
  fromBank: string;

  @Column({ type: 'varchar', length: 50 })
  toBank: string;

  @Column({ type: 'varchar', length: 50 })
  fromAccountNumber: string;

  @Column({ type: 'varchar', length: 50 })
  toAccountNumber: string;

  @Column({ type: 'int', default: 0 })
  manguitos: number;

  @Column({ 
    type: 'enum', 
    enum: ['PENDING_TRANSFER', 'TRANSFERRED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING_TRANSFER'
  })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transferReference: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 