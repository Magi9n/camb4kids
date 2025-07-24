import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id, { eager: true })
  user: User;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: ['buy', 'sell'] })
  type: 'buy' | 'sell';

  @Column('decimal', { precision: 12, scale: 4 })
  value: number;

  @Column({ default: false })
  triggered: boolean;

  @Column({ type: 'timestamp', nullable: true })
  triggeredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 