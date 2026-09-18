import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @RelationId((category: Category) => category.user)
  userId: string;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'parent_category_id',
  })
  parentCategory: Category | null;

  @RelationId((category: Category) => category.parentCategory)
  parentCategoryId: string | null;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subcategories: Category[];

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  color: string;

  @Column({
    type: 'varchar',
  })
  icon: string;

  @Column({
    name: 'sort_order',
    type: 'integer',
    default: 0,
  })
  sortOrder: number;

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt: Date | null;
}
