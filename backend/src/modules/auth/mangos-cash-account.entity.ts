import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('mangos_cash_accounts')
export class MangosCashAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  bank: string; // 'bcp', 'bbva', 'scotiabank', 'interbank'

  @Column({ type: 'varchar', length: 100 })
  bankFullName: string; // 'BCP - Banco de Crédito del Perú'

  @Column({ type: 'varchar', length: 20 })
  currency: string; // 'soles', 'dollars'

  @Column({ type: 'varchar', length: 50 })
  accountNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cci: string; // Solo para Interbank

  @Column({ type: 'varchar', length: 20 })
  ruc: string;

  @Column({ type: 'varchar', length: 100 })
  accountHolder: string; // 'MangosCash SAC'

  @Column({ type: 'varchar', length: 50 })
  accountType: string; // 'Cuenta Corriente', 'Cuenta de Ahorros'

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 