import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, IsNull } from 'typeorm';

import { Category, CategoryType } from './entities/category.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { DEFAULT_CATEGORIES } from './constants/default-categories';

export interface CategoryTreeNode {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  type: CategoryType;
  parentCategoryId: string | null;
  subcategories: CategoryTreeNode[];
}
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {}

  private async findUserCategories(categoryId: string, userId: string) {
    const category = await this.categoriesRepository.findOne({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async getCategories(userId: string): Promise<CategoryTreeNode[]> {
    const categories = await this.categoriesRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    const nodes = new Map<string, CategoryTreeNode>(
      categories.map((category) => [
        category.id,
        {
          id: category.id,
          name: category.name,
          color: category.color,
          icon: category.icon,
          type: category.type,
          parentCategoryId: category.parentCategoryId,
          subcategories: [],
        },
      ]),
    );

    const roots: CategoryTreeNode[] = [];

    for (const node of nodes.values()) {
      if (node.parentCategoryId === null) {
        roots.push(node);
        continue;
      }

      const parent = nodes.get(node.parentCategoryId);

      if (parent) {
        parent.subcategories.push(node);
      }
    }

    return roots;
  }

  async createCategory(userId: string, data: CreateCategoryDto) {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Category);

      const category = repository.create({
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
        user: { id: userId },
        parentCategory: null,
      });

      const savedCategory = await repository.save(category);

      await this.createSubcategories(
        manager,
        savedCategory,
        data.subcategories ?? [],
        userId,
        data.type,
      );

      return repository.findOne({
        where: {
          id: savedCategory.id,
          user: { id: userId },
        },
        relations: {
          subcategories: true,
        },
      });
    });
  }

  private async createSubcategories(
    manager: EntityManager,
    parent: Category,
    subcategories: CreateCategoryDto['subcategories'],
    userId: string,
    type: Category['type'],
  ): Promise<void> {
    if (!subcategories?.length) {
      return;
    }

    const repository = manager.getRepository(Category);

    for (const subcategoryData of subcategories) {
      const subcategory = repository.create({
        name: subcategoryData.name,
        type,
        color: null,
        icon: null,
        user: { id: userId },
        parentCategory: parent,
      });

      const savedSubcategory = await repository.save(subcategory);

      await this.createSubcategories(
        manager,
        savedSubcategory,
        subcategoryData.subcategories ?? [],
        userId,
        type,
      );
    }
  }

  async updateCategory(
    categoryId: string,
    userId: string,
    data: UpdateCategoryDto,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Category);
      const category = await repository.findOne({
        where: { id: categoryId, user: { id: userId } },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (data.name !== undefined) category.name = data.name;
      if (data.color !== undefined) category.color = data.color;
      if (data.icon !== undefined) category.icon = data.icon;
      if (data.type !== undefined) category.type = data.type;
      await repository.save(category);

      if (data.subcategories !== undefined) {
        await this.syncSubcategories(
          manager,
          category,
          data.subcategories,
          userId,
          category.type,
        );
      } else if (data.type !== undefined) {
        await this.updateDescendantTypes(
          manager,
          category,
          userId,
          category.type,
        );
      }
    });

    const categories = await this.getCategories(userId);
    return categories.find((item) => item.id === categoryId);
  }

  private async syncSubcategories(
    manager: EntityManager,
    parent: Category,
    inputs: NonNullable<UpdateCategoryDto['subcategories']>,
    userId: string,
    type: CategoryType,
  ): Promise<void> {
    const repository = manager.getRepository(Category);
    const existing = await repository.find({
      where: { parentCategory: { id: parent.id }, user: { id: userId } },
    });
    const existingById = new Map(existing.map((item) => [item.id, item]));
    const retainedIds = new Set<string>();

    for (const input of inputs) {
      let child: Category;
      if (input.id) {
        const existingChild = existingById.get(input.id);
        if (!existingChild || retainedIds.has(input.id)) {
          throw new BadRequestException('Invalid subcategory id');
        }
        child = existingChild;
        retainedIds.add(input.id);
        child.name = input.name;
        child.type = type;
      } else {
        child = repository.create({
          name: input.name,
          type,
          color: null,
          icon: null,
          user: { id: userId },
          parentCategory: parent,
        });
      }

      const savedChild = await repository.save(child);
      if (input.subcategories !== undefined) {
        await this.syncSubcategories(
          manager,
          savedChild,
          input.subcategories,
          userId,
          type,
        );
      } else if (input.id) {
        await this.updateDescendantTypes(manager, savedChild, userId, type);
      }
    }

    for (const child of existing) {
      if (!retainedIds.has(child.id)) {
        await this.softDeleteSubtree(manager, child, userId);
      }
    }
  }

  private async updateDescendantTypes(
    manager: EntityManager,
    parent: Category,
    userId: string,
    type: CategoryType,
  ): Promise<void> {
    const repository = manager.getRepository(Category);
    const children = await repository.find({
      where: { parentCategory: { id: parent.id }, user: { id: userId } },
    });
    for (const child of children) {
      child.type = type;
      await repository.save(child);
      await this.updateDescendantTypes(manager, child, userId, type);
    }
  }

  private async softDeleteSubtree(
    manager: EntityManager,
    category: Category,
    userId: string,
  ): Promise<void> {
    const repository = manager.getRepository(Category);
    const children = await repository.find({
      where: { parentCategory: { id: category.id }, user: { id: userId } },
    });
    for (const child of children) {
      await this.softDeleteSubtree(manager, child, userId);
    }
    await repository.softRemove(category);
  }

  async deleteCategory(categoryId: string, userId: string) {
    const category = await this.categoriesRepository.findOne({
      where: {
        id: categoryId,
        userId,
      },
      relations: {
        subcategories: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    // Логику физического/мягкого удаления
    // добавим после появления Transaction entity.

    await this.categoriesRepository.softRemove(category);

    return {
      message: 'Category deleted',
    };
  }

  async createDefaultCategories(userId: string, manager: EntityManager) {
    const categories = DEFAULT_CATEGORIES.map((category) =>
      manager.create(Category, {
        ...category,
        user: {
          id: userId,
        },
      }),
    );

    await manager.save(Category, categories);
  }
}
