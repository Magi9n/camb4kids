import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountType: string;

  @Column()
  bank: string;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column({
    type: 'enum',
    enum: ['soles', 'dollars'],
    default: 'soles'
  })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, user => user.bankAccounts)
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 