import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './entities/user.entity';

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

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
  fromCurrency: string; // 'PEN' o 'USD'

  @Column({ type: 'varchar', length: 10 })
  toCurrency: string; // 'USD' o 'PEN'

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

  @Column({ type: 'enum', enum: ['PENDING_TRANSFER', 'TRANSFERRED', 'COMPLETED', 'CANCELLED'], default: 'PENDING_TRANSFER' })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transferReference: string; // Número de operación del banco

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 