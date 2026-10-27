import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories(@CurrentUser() user: User) {
    return this.categoriesService.getCategories(user.id);
  }

  @Post()
  createCategory(@CurrentUser() user: User, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(user.id, dto);
  }

  @Patch(':id')
  updateCategory(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, user.id, dto);
  }

  @Delete(':id')
  deleteCategory(@CurrentUser() user: User, @Param() id: string) {
    this.categoriesService.deleteCategory(id, user.id);
  }
}
