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
  nombre: string;

  @Column({ type: 'varchar', length: 20 })
  dni: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  importe_envia: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  importe_recibe: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  tipo_cambio: number;

  @Column({ type: 'varchar', length: 10 })
  moneda_envia: string;

  @Column({ type: 'varchar', length: 10 })
  moneda_recibe: string;

  @Column({ type: 'varchar', length: 30, default: 'Falta Transferir' })
  estado: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 