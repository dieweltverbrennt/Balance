import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
