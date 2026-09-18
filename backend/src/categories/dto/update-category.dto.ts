import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CategoryType } from '../entities/category.entity';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  color?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  icon?: string;
}
