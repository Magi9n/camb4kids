import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('email_changes')
export class EmailChange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  currentEmail: string;

  @Column()
  newEmail: string;

  @Column()
  verificationCode: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;
} 