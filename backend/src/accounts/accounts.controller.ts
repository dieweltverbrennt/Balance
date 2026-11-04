import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  getAccounts(@CurrentUser() user: User) {
    return this.accountsService.getAccounts(user.id);
  }

  @Get(':id')
  getAccount(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.accountsService.getAccount(id, user.id);
  }

  @Post()
  createAccount(@CurrentUser() user: User, @Body() dto: CreateAccountDto) {
    return this.accountsService.createAccount(user.id, dto);
  }

  @Patch(':id')
  updateAccount(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(id, user.id, dto);
  }

  @Delete(':id')
  deleteAccount(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.accountsService.deleteAccount(id, user.id);
  }
}
