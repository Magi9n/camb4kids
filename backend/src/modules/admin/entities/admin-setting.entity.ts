import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('admin_settings')
export class AdminSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 4, default: 0 })
  variationPercent: number;

  @Column({ default: '08:00' })
  cronStart: string;

  @Column({ default: '20:00' })
  cronEnd: string;

  @Column('decimal', { precision: 5, scale: 4, default: 1 })
  buyPercent: number;

  @Column('decimal', { precision: 5, scale: 4, default: 1 })
  sellPercent: number;

  @UpdateDateColumn()
  updatedAt: Date;
} 