import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

export enum AccountType {
  CASH = 'cash',
  DEBIT = 'debit',
  CREDIT = 'credit',
  SAVINGS = 'savings',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'bank_name', type: 'varchar', nullable: true })
  bankName: string | null;

  @Column({
    type: 'enum',
    enum: AccountType,
    enumName: 'accounts_type_enum',
  })
  type: AccountType;

  @Column({ name: 'currency_code', type: 'char', length: 3 })
  currencyCode: string;

  @Column({
    name: 'initial_balance',
    type: 'numeric',
    precision: 19,
    scale: 4,
    default: 0,
  })
  initialBalance: string;

  @Column({ name: 'is_archived', type: 'boolean', default: false })
  isArchived: boolean;

  @ManyToOne(() => User, (user) => user.accounts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((account: Account) => account.user)
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
