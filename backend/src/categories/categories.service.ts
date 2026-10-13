import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

import { Category } from './entities/category.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { DEFAULT_CATEGORIES } from './constants/default-categories';

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

  async getCategories(userId: string) {
    const categories = await this.categoriesRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        subcategories: true,
      },
    });

    return categories;
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
    const category = await this.findUserCategories(categoryId, userId);

    Object.assign(category, data);

    return this.categoriesRepository.save(category);
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
