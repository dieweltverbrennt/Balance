import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
