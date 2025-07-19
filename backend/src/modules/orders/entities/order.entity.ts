import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export type OrderStatus = 'EN_PROCESO' | 'DEPOSITADO' | 'COMPLETADO';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column()
  fromCurrency: string;

  @Column()
  toCurrency: string;

  @Column('decimal', { precision: 12, scale: 4 })
  rate: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ default: 'EN_PROCESO' })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 