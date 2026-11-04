import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
  })
  passwordHash: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @ManyToOne(() => Account, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'default_account_id' })
  defaultAccount: Account | null;

  @RelationId((user: User) => user.defaultAccount)
  defaultAccountId: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}
