import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Category } from './entities/category.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
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
    return this.categoriesRepository.find({
      where: {
        userId,
      },
      relations: {
        subcategories: true,
      },
      order: {
        sortOrder: 'ASC',
      },
    });
  }

  async createCategory(userId: string, data: CreateCategoryDto) {
    let parentCategory: Category | null = null;

    if (data.parentCategoryId) {
      parentCategory = await this.categoriesRepository.findOne({
        where: {
          id: data.parentCategoryId,
          userId: userId,
        },
      });

      if (!parentCategory) {
        throw new NotFoundException('Родительская категория не найдена');
      }

      if (parentCategory.parentCategoryId) {
        throw new BadRequestException(
          'У подкатегории не может быть подкатегорий',
        );
      }

      if (parentCategory.type !== data.type) {
        throw new BadRequestException(
          'Тип категории должен совпадать с типом родительской категории',
        );
      }
    }

    const category = this.categoriesRepository.create({
      name: data.name,
      type: data.type,
      color: data.color,
      icon: data.icon,
      sortOrder: data.sortOrder ?? 0,
      user: {
        id: userId,
      },
      parentCategory,
    });

    return this.categoriesRepository.save(category);
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

  async reorderCategories(userId: string, data: ReorderCategoriesDto) {
    const categories = await this.categoriesRepository.find({
      where: {
        userId,
        id: In(data.categoryIds),
      },
    });

    if (categories.length !== data.categoryIds.length) {
      throw new NotFoundException('Одна или несколько категорий не найдены');
    }

    const parentCategoryIds = new Set(
      categories.map((category) => category.parentCategoryId ?? null),
    );

    if (parentCategoryIds.size > 1) {
      throw new BadRequestException('Категории должны быть на одном уровне');
    }

    await this.categoriesRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await Promise.all(
          data.categoryIds.map((categoryId, index) =>
            transactionalEntityManager.update(
              Category,
              {
                id: categoryId,
                userId,
              },
              {
                sortOrder: index,
              },
            ),
          ),
        );
      },
    );

    return this.categoriesRepository.find({
      where: {
        userId,
        id: In(data.categoryIds),
      },
      order: {
        sortOrder: 'ASC',
      },
    });
  }
}
