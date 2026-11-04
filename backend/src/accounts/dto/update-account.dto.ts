import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { AccountType } from '../entities/account.entity';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string | null;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currencyCode?: string;

  @IsOptional()
  @IsString()
  @Matches(/^-?\d{1,15}(?:\.\d{1,4})?$/)
  initialBalance?: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
